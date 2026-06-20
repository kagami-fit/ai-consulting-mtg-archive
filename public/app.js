const state = {
  records: [],
  selectedId: null,
  query: "",
};

const els = {
  archiveList: document.querySelector("#archiveList"),
  detailPane: document.querySelector("#detailPane"),
  refreshButton: document.querySelector("#refreshButton"),
  searchInput: document.querySelector("#searchInput"),
  recordCount: document.querySelector("#recordCount"),
  clientCount: document.querySelector("#clientCount"),
  actionCount: document.querySelector("#actionCount"),
  imageLightbox: document.querySelector("#imageLightbox"),
  lightboxImage: document.querySelector("#lightboxImage"),
  lightboxClose: document.querySelector("#lightboxClose"),
};

await init();

async function init() {
  els.refreshButton.addEventListener("click", () => loadRecords());
  els.searchInput.addEventListener("input", handleSearchInput);
  els.detailPane.addEventListener("click", handleDetailClick);
  els.imageLightbox.addEventListener("click", handleLightboxClick);
  els.lightboxClose.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", handleDocumentKeydown);
  await loadRecords();
}

async function loadRecords() {
  state.records = await fetchRecords();
  renderStats();
  renderArchive();

  if (!state.records.length) {
    renderEmpty("議事録がまだありません", "records.json に会議データを追加すると、この画面に表示されます。");
    return;
  }

  const visibleRecords = getVisibleRecords();
  const selectedStillVisible = visibleRecords.some((record) => record.id === state.selectedId);

  if (!visibleRecords.length) {
    renderEmpty("該当する議事録がありません", "検索条件を変えると候補が表示されます。");
    return;
  }

  await selectRecord(selectedStillVisible ? state.selectedId : visibleRecords[0].id, { keepScroll: true });
}

async function fetchRecords() {
  const response = await fetch(`./records.json?v=${Date.now()}`);
  if (response.ok) {
    const records = await response.json();
    return normalizeRecords(records);
  }

  const fallback = await fetch("./api/records");
  if (!fallback.ok) return [];
  return normalizeRecords(await fallback.json());
}

function normalizeRecords(records) {
  return [...(records || [])].sort((a, b) => {
    const left = `${b.meetingDate || ""}${b.createdAt || ""}`;
    const right = `${a.meetingDate || ""}${a.createdAt || ""}`;
    return left.localeCompare(right);
  });
}

async function selectRecord(id, options = {}) {
  state.selectedId = id;
  renderArchive();
  const record = state.records.find((item) => item.id === id);
  if (!record) {
    renderEmpty("議事録を選択", "日付別アーカイブから選ぶと、要約・決定事項・アクション・図解を表示します。");
    return;
  }

  renderDetail(record);
  if (!options.keepScroll) {
    els.detailPane.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function handleSearchInput(event) {
  state.query = event.target.value;
  const visibleRecords = getVisibleRecords();
  renderArchive();

  if (!visibleRecords.length) {
    renderEmpty("該当する議事録がありません", "検索条件を変えると候補が表示されます。");
    return;
  }

  if (!visibleRecords.some((record) => record.id === state.selectedId)) {
    selectRecord(visibleRecords[0].id, { keepScroll: true });
  }
}

function renderStats() {
  const clients = new Set(state.records.map((record) => record.clientName).filter(Boolean));
  const actionCount = state.records.reduce((total, record) => total + (record.minutes?.actionItems?.length || 0), 0);
  els.recordCount.textContent = String(state.records.length);
  els.clientCount.textContent = String(clients.size || state.records.length);
  els.actionCount.textContent = String(actionCount);
}

function renderArchive() {
  const visibleRecords = getVisibleRecords();
  if (!state.records.length) {
    els.archiveList.innerHTML = `<div class="date-heading">まだ公開済みの議事録がありません</div>`;
    return;
  }

  if (!visibleRecords.length) {
    els.archiveList.innerHTML = `<div class="date-heading">検索結果なし</div>`;
    return;
  }

  const groups = groupByDate(visibleRecords);
  els.archiveList.innerHTML = Object.entries(groups)
    .map(([date, records]) => {
      const buttons = records
        .map(
          (record) => `
          <button class="record-button ${record.id === state.selectedId ? "active" : ""}" type="button" data-id="${escapeHtml(record.id)}">
            <span class="record-title">${escapeHtml(record.title)}</span>
            <span class="record-client">${escapeHtml(record.clientName || "Client")}</span>
            <span class="record-meta">
              <span class="status-dot ${statusClass(record.status)}"></span>
              ${escapeHtml(record.category || "議事録")}
              ${record.duration ? ` / ${escapeHtml(record.duration)}` : ""}
            </span>
          </button>`
        )
        .join("");
      return `<div class="date-group"><div class="date-heading">${escapeHtml(formatDate(date))}</div>${buttons}</div>`;
    })
    .join("");

  els.archiveList.querySelectorAll(".record-button").forEach((button) => {
    button.addEventListener("click", () => selectRecord(button.dataset.id));
  });
}

function renderDetail(record) {
  const minutes = record.minutes || {};
  els.detailPane.classList.remove("empty-state");
  els.detailPane.innerHTML = `
    <div class="detail-header">
      <div class="detail-title-row">
        <div>
          <p class="eyebrow">${escapeHtml(record.category || "Meeting Minutes")}</p>
          <h2>${escapeHtml(record.title)}</h2>
          <div class="detail-meta">
            ${record.clientName ? `<span class="pill">${escapeHtml(record.clientName)}</span>` : ""}
            <span class="pill">${escapeHtml(formatDate(record.meetingDate))}</span>
            ${record.participants?.length ? `<span class="pill">${escapeHtml(record.participants.join(" / "))}</span>` : ""}
            ${record.location ? `<span class="pill">${escapeHtml(record.location)}</span>` : ""}
            ${record.duration ? `<span class="pill">${escapeHtml(record.duration)}</span>` : ""}
          </div>
        </div>
        <span class="record-status ${statusClass(record.status)}">${escapeHtml(statusLabel(record.status))}</span>
      </div>
      ${record.notes ? `<p class="lead">${escapeHtml(record.notes)}</p>` : ""}
    </div>
    <div class="detail-body">
      ${videoSection(record)}
      ${diagramSection(record)}
      <div class="insight-grid">
        ${listPanel("要約", minutes.summary)}
        ${listPanel("議題", minutes.agenda)}
        ${listPanel("決定事項", minutes.decisions)}
        ${actionPanel(minutes.actionItems)}
        ${listPanel("課題・懸念", minutes.risks)}
        ${listPanel("次回までに", minutes.nextSteps)}
      </div>
      ${keywordSection(minutes.keywords)}
      ${timelineSection(record.timeline)}
      ${transcriptSection(record.transcriptSummary)}
    </div>
  `;
}

function videoSection(record) {
  const embedUrl = youtubeEmbedUrl(record.videoUrl || record.youtubeUrl);
  if (embedUrl) {
    return `
      <section class="video-section">
        <div class="section-heading">
          <h3>動画</h3>
          ${record.videoTitle ? `<p>${escapeHtml(record.videoTitle)}</p>` : ""}
        </div>
        <div class="video-frame">
          <iframe src="${escapeHtml(embedUrl)}" title="${escapeHtml(record.videoTitle || record.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </section>
    `;
  }

  return `
    <section class="video-section">
      <div class="section-heading">
        <h3>動画</h3>
        <p>YouTubeアップロード後にURLを設定</p>
      </div>
      <div class="video-placeholder">
        <div class="play-symbol" aria-hidden="true">▶</div>
        <div>
          <strong>動画URL未設定</strong>
          <span>records.json の videoUrl にYouTube URLを入れると埋め込み表示されます。</span>
        </div>
      </div>
    </section>
  `;
}

function listPanel(title, items = []) {
  const body = (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `
    <section class="insight-panel">
      <h3>${escapeHtml(title)}</h3>
      <ul>${body || "<li>未記載</li>"}</ul>
    </section>
  `;
}

function actionPanel(items = []) {
  const rows = (items || [])
    .map(
      (item) => `
      <tr>
        <td data-label="担当">${escapeHtml(item.owner || "未設定")}</td>
        <td data-label="タスク">${escapeHtml(item.task || "")}</td>
        <td data-label="期限">${escapeHtml(item.due || "未設定")}</td>
        <td data-label="状態"><span class="state-badge">${escapeHtml(item.status || "未着手")}</span></td>
      </tr>`
    )
    .join("");
  return `
    <section class="insight-panel action-panel">
      <h3>アクション</h3>
      <table class="action-table">
        <thead><tr><th>担当</th><th>タスク</th><th>期限</th><th>状態</th></tr></thead>
        <tbody>${rows || `<tr><td data-label="担当">未設定</td><td data-label="タスク">未記載</td><td data-label="期限">未設定</td><td data-label="状態"><span class="state-badge">未着手</span></td></tr>`}</tbody>
      </table>
    </section>
  `;
}

function diagramSection(record) {
  if (!record.diagramUrl) return "";
  const url = `${assetUrl(record.diagramUrl)}?v=${encodeURIComponent(record.updatedAt || "")}`;
  return `
    <section class="diagram-section">
      <div class="section-heading">
        <h3>図解</h3>
        ${record.diagramCaption ? `<p>${escapeHtml(record.diagramCaption)}</p>` : ""}
      </div>
      <div class="diagram-frame">
        <button class="diagram-zoom-button" type="button" data-lightbox-src="${escapeHtml(url)}" data-lightbox-alt="${escapeHtml(record.title)}の図解" aria-label="${escapeHtml(record.title)}の図解を拡大">
          <img src="${escapeHtml(url)}" alt="${escapeHtml(record.title)}の図解" />
        </button>
      </div>
    </section>
  `;
}

function keywordSection(keywords = []) {
  if (!keywords?.length) return "";
  const chips = keywords
    .map((keyword) => `<span class="keyword-chip">${escapeHtml(keyword.term)}<b>${escapeHtml(keyword.count ?? "")}</b></span>`)
    .join("");
  return `
    <section class="keyword-section">
      <div class="section-heading">
        <h3>キーワード</h3>
      </div>
      <div class="keyword-list">${chips}</div>
    </section>
  `;
}

function timelineSection(items = []) {
  if (!items?.length) return "";
  const body = items
    .map(
      (item) => `
      <li>
        <time>${escapeHtml(item.time || "")}</time>
        <div>
          <strong>${escapeHtml(item.title || "")}</strong>
          ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
        </div>
      </li>`
    )
    .join("");
  return `
    <section class="timeline-section">
      <div class="section-heading">
        <h3>流れ</h3>
      </div>
      <ol>${body}</ol>
    </section>
  `;
}

function transcriptSection(items = []) {
  if (!items?.length) return "";
  const body = Array.isArray(items)
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : `<p>${escapeHtml(items)}</p>`;
  return `
    <details class="transcript-section">
      <summary>文字起こし要約</summary>
      <div class="transcript-text">${body}</div>
    </details>
  `;
}

function handleDetailClick(event) {
  const button = event.target.closest("[data-lightbox-src]");
  if (!button) return;
  openLightbox(button.dataset.lightboxSrc, button.dataset.lightboxAlt || "");
}

function openLightbox(src, alt) {
  els.lightboxImage.src = src;
  els.lightboxImage.alt = alt;
  els.imageLightbox.hidden = false;
  els.imageLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  els.lightboxClose.focus();
}

function closeLightbox() {
  els.imageLightbox.hidden = true;
  els.imageLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  els.lightboxImage.removeAttribute("src");
}

function handleLightboxClick(event) {
  if (event.target.closest("[data-lightbox-close]")) {
    closeLightbox();
  }
}

function handleDocumentKeydown(event) {
  if (event.key === "Escape" && !els.imageLightbox.hidden) {
    closeLightbox();
  }
}

function getVisibleRecords() {
  const query = state.query.trim().toLowerCase();
  if (!query) return state.records;
  return state.records.filter((record) => recordSearchText(record).includes(query));
}

function recordSearchText(record) {
  const minutes = record.minutes || {};
  const buckets = [
    record.title,
    record.clientName,
    record.category,
    record.location,
    record.notes,
    ...(record.participants || []),
    ...(minutes.summary || []),
    ...(minutes.agenda || []),
    ...(minutes.decisions || []),
    ...(minutes.risks || []),
    ...(minutes.nextSteps || []),
    ...(minutes.keywords || []).map((keyword) => keyword.term),
    ...(minutes.actionItems || []).flatMap((item) => [item.owner, item.task, item.due, item.status]),
  ];
  return buckets.filter(Boolean).join(" ").toLowerCase();
}

function youtubeEmbedUrl(value) {
  if (!value) return "";

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${encodeURIComponent(url.pathname.slice(1))}`;
    }
    if (url.pathname.startsWith("/embed/")) {
      return value;
    }
    if (url.pathname.startsWith("/shorts/")) {
      return `https://www.youtube.com/embed/${encodeURIComponent(url.pathname.split("/")[2])}`;
    }
    const videoId = url.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : "";
  } catch (_error) {
    return "";
  }
}

function assetUrl(value) {
  const url = String(value || "");
  return url.startsWith("/") ? `.${url}` : url;
}

function statusClass(status = "") {
  const normalized = String(status).toLowerCase();
  if (normalized === "draft") return "draft";
  if (normalized === "waiting-video") return "processing";
  if (normalized === "error") return "error";
  return "published";
}

function statusLabel(status = "") {
  const labels = {
    draft: "下書き",
    "waiting-video": "動画待ち",
    error: "要確認",
    published: "公開中",
  };
  return labels[status] || labels.published;
}

function renderEmpty(title, copy) {
  els.detailPane.classList.add("empty-state");
  els.detailPane.innerHTML = `
    <div class="empty-copy">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(copy)}</p>
    </div>
  `;
}

function groupByDate(records) {
  return records.reduce((groups, record) => {
    const date = record.meetingDate || "日付未設定";
    groups[date] ||= [];
    groups[date].push(record);
    return groups;
  }, {});
}

function formatDate(date) {
  if (!date || date === "日付未設定") return "日付未設定";
  const parsed = new Date(`${date}T00:00:00+09:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(parsed);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
