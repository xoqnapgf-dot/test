(() => {
  "use strict";

  const Core = window.MonkeyCore;
  const STORE_KEY = "infinite-monkey-lab.state.v1";
  const FALLBACK_VERSION = "1.0.0";
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const $ = (id) => document.getElementById(id);

  const elements = {
    standaloneHint: $("standaloneHint"),
    closeStandaloneHint: $("closeStandaloneHint"),
    versionBadge: $("versionBadge"),
    storageNotice: $("storageNotice"),
    startupNotice: $("startupNotice"),
    experimentPage: $("experimentPage"),
    savedPage: $("savedPage"),
    currentSeedValue: $("currentSeedValue"),
    nextKValue: $("nextKValue"),
    copySeedButton: $("copySeedButton"),
    openSeedChooserButton: $("openSeedChooserButton"),
    newSeedButton: $("newSeedButton"),
    mainCanvas: $("mainCanvas"),
    canvasPlaceholder: $("canvasPlaceholder"),
    sampleStateTag: $("sampleStateTag"),
    verifyButton: $("verifyButton"),
    sampleLabel: $("sampleLabel"),
    sampleSeedLine: $("sampleSeedLine"),
    sampleModePill: $("sampleModePill"),
    compressionValue: $("compressionValue"),
    adjacencyValue: $("adjacencyValue"),
    metricNotice: $("metricNotice"),
    sampleStatus: $("sampleStatus"),
    drawButton: $("drawButton"),
    decisionActions: $("decisionActions"),
    ignoreButton: $("ignoreButton"),
    saveButton: $("saveButton"),
    decisionCountdown: $("decisionCountdown"),
    saveConfirm: $("saveConfirm"),
    saveNoteInput: $("saveNoteInput"),
    cancelSaveButton: $("cancelSaveButton"),
    confirmSaveButton: $("confirmSaveButton"),
    undoBox: $("undoBox"),
    undoButton: $("undoButton"),
    undoCountdown: $("undoCountdown"),
    downloadActions: $("downloadActions"),
    downloadHeading: $("downloadHeading"),
    downloadOriginalButton: $("downloadOriginalButton"),
    download4xButton: $("download4xButton"),
    replayForm: $("replayForm"),
    replaySeedInput: $("replaySeedInput"),
    replayKInput: $("replayKInput"),
    replayButton: $("replayButton"),
    totalDrawnValue: $("totalDrawnValue"),
    totalSavedValue: $("totalSavedValue"),
    minCompressionValue: $("minCompressionValue"),
    lastExportValue: $("lastExportValue"),
    backupReminder: $("backupReminder"),
    backupReminderText: $("backupReminderText"),
    storageStatusPill: $("storageStatusPill"),
    exportButton: $("exportButton"),
    importButton: $("importButton"),
    importFileInput: $("importFileInput"),
    backupStatus: $("backupStatus"),
    openClearModalButton: $("openClearModalButton"),
    savedList: $("savedList"),
    savedEmpty: $("savedEmpty"),
    savedCountBadge: $("savedCountBadge"),
    savedNavCount: $("savedNavCount"),
    goToExperimentButton: $("goToExperimentButton"),
    seedChooserModal: $("seedChooserModal"),
    seedChoiceSelect: $("seedChoiceSelect"),
    confirmSeedChoiceButton: $("confirmSeedChoiceButton"),
    detailModal: $("detailModal"),
    detailCanvas: $("detailCanvas"),
    detailMeta: $("detailMeta"),
    detailNoteInput: $("detailNoteInput"),
    saveDetailNoteButton: $("saveDetailNoteButton"),
    detailStatus: $("detailStatus"),
    detailDownloadOriginalButton: $("detailDownloadOriginalButton"),
    detailDownload4xButton: $("detailDownload4xButton"),
    closeDetailButton: $("closeDetailButton"),
    requestDeleteSavedButton: $("requestDeleteSavedButton"),
    deleteConfirmPanel: $("deleteConfirmPanel"),
    cancelDeleteSavedButton: $("cancelDeleteSavedButton"),
    confirmDeleteSavedButton: $("confirmDeleteSavedButton"),
    clearRecordsModal: $("clearRecordsModal"),
    clearStepOne: $("clearStepOne"),
    clearStepTwo: $("clearStepTwo"),
    continueClearButton: $("continueClearButton"),
    backFromClearButton: $("backFromClearButton"),
    confirmClearButton: $("confirmClearButton"),
  };

  const palette = new Uint8Array(256 * 3);
  if (Core) {
    for (let colorIndex = 0; colorIndex < 256; colorIndex += 1) {
      const rgb = Core.colorForIndex(colorIndex);
      palette[colorIndex * 3] = rgb[0];
      palette[colorIndex * 3 + 1] = rgb[1];
      palette[colorIndex * 3 + 2] = rgb[2];
    }
  }

  let appState = null;
  let storageWritable = true;
  let pendingCard = null;
  let currentCard = null;
  let undoCard = null;
  let undoExpiresAt = 0;
  let decisionReady = false;
  let saveDialogOpen = false;
  let decisionTimer = null;
  let undoTimer = null;
  let metricsRunId = 0;
  let historyEpoch = 0;
  let detailRecord = null;
  let thumbObserver = null;
  let lastFocusBeforeModal = null;

  function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function safeTime(value) {
    if (typeof value !== "string" || !value.trim()) return new Date().toISOString();
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : new Date().toISOString();
  }

  function readSavedEntry(entry, strict) {
    if (!isPlainObject(entry)) {
      if (strict) throw new TypeError("保存列表中包含无效记录。");
      return null;
    }
    const k = Number(entry.k);
    if (!Number.isSafeInteger(k) || k < 0 || k >= Core.MAX_K) {
      if (strict) throw new TypeError("保存记录的 k 必须是有效的非负整数。");
      return null;
    }
    const timeValue = entry.time ?? entry["时间"];
    const noteValue = entry.note ?? entry["备注"];
    return {
      k,
      时间: safeTime(typeof timeValue === "string" ? timeValue : ""),
      备注: typeof noteValue === "string" ? noteValue.slice(0, 240) : "",
    };
  }

  function normalizeRecords(input, strict) {
    if (!isPlainObject(input)) {
      if (strict) throw new TypeError("JSON 文件中没有有效的 records 对象。");
      return Object.create(null);
    }
    const records = Object.create(null);
    for (const rawSeed of Object.keys(input)) {
      let seed;
      try {
        seed = Core.normalizeSeed(rawSeed);
      } catch (error) {
        if (strict) throw new TypeError(`无效的主种子：${rawSeed}`);
        continue;
      }
      const rawRecord = input[rawSeed];
      if (!isPlainObject(rawRecord)) {
        if (strict) throw new TypeError(`主种子 ${seed} 的记录格式无效。`);
        continue;
      }
      let nextK = Number(rawRecord.nextK);
      if (!Number.isSafeInteger(nextK) || nextK < 0) {
        if (strict) throw new TypeError(`主种子 ${seed} 的 nextK 无效。`);
        nextK = 0;
      }
      const rawSaved = Array.isArray(rawRecord.saved) ? rawRecord.saved : [];
      if (strict && !Array.isArray(rawRecord.saved)) throw new TypeError(`主种子 ${seed} 的 saved 必须是数组。`);
      const savedByK = new Map();
      for (const rawEntry of rawSaved) {
        const entry = readSavedEntry(rawEntry, strict);
        if (!entry) continue;
        const existing = savedByK.get(entry.k);
        if (!existing) {
          savedByK.set(entry.k, entry);
        } else {
          // Keep the first value, while recovering a missing note from a duplicate import.
          if (!existing.备注 && entry.备注) existing.备注 = entry.备注;
          if (!existing.时间 && entry.时间) existing.时间 = entry.时间;
        }
      }
      const saved = Array.from(savedByK.values()).sort((left, right) => left.k - right.k);
      const maxSavedK = saved.reduce((maximum, item) => Math.max(maximum, item.k), -1);
      if (maxSavedK >= nextK) nextK = maxSavedK + 1;
      records[seed] = { nextK, saved };
    }
    return records;
  }

  function defaultSeedFromRecords(records) {
    const seeds = Object.keys(records || {});
    if (!seeds.length) return "";
    seeds.sort((left, right) => {
      const difference = records[right].nextK - records[left].nextK;
      return difference || left.localeCompare(right);
    });
    return seeds[0];
  }

  function newEmptyState(seed) {
    const normalized = Core.normalizeSeed(seed);
    const records = Object.create(null);
    records[normalized] = { nextK: 0, saved: [] };
    return {
      records,
      currentSeed: normalized,
      historyMinCompressionRatio: null,
      lastExportAt: null,
    };
  }

  function normalizeLocalState(parsed) {
    if (!isPlainObject(parsed)) throw new TypeError("本地记录格式无效。");
    const records = normalizeRecords(parsed.records, false);
    let currentSeed = "";
    try {
      currentSeed = Core.normalizeSeed(parsed.currentSeed);
    } catch (_) {
      currentSeed = "";
    }
    if (!currentSeed || !records[currentSeed]) currentSeed = defaultSeedFromRecords(records);
    if (!currentSeed) return null;
    let historyMinCompressionRatio = parsed.historyMinCompressionRatio ?? parsed.historyMinRatio ?? null;
    historyMinCompressionRatio = Number.isFinite(Number(historyMinCompressionRatio)) && historyMinCompressionRatio !== null
      ? Number(historyMinCompressionRatio)
      : null;
    if (historyMinCompressionRatio !== null && historyMinCompressionRatio < 0) historyMinCompressionRatio = null;
    const lastExportAt = typeof parsed.lastExportAt === "string" && Number.isFinite(Date.parse(parsed.lastExportAt))
      ? new Date(Date.parse(parsed.lastExportAt)).toISOString()
      : null;
    return { records, currentSeed, historyMinCompressionRatio, lastExportAt };
  }

  function readLocalState() {
    let raw = null;
    try {
      raw = window.localStorage.getItem(STORE_KEY);
    } catch (_) {
      storageWritable = false;
      return { state: null, firstRun: false, error: "无法读取浏览器本地存储。" };
    }
    if (raw === null) return { state: null, firstRun: true, error: "" };
    try {
      const parsed = JSON.parse(raw);
      const state = normalizeLocalState(parsed);
      if (!state) return { state: null, firstRun: false, error: "本地记录中没有主种子，已创建新的记录。" };
      return { state, firstRun: false, error: "" };
    } catch (_) {
      return { state: null, firstRun: false, error: "本地记录无法读取，已在内存中建立新记录；如有备份，可导入恢复。" };
    }
  }

  function persistState() {
    try {
      const serializable = {
        records: appState.records,
        currentSeed: appState.currentSeed,
        historyMinCompressionRatio: appState.historyMinCompressionRatio,
        lastExportAt: appState.lastExportAt,
      };
      window.localStorage.setItem(STORE_KEY, JSON.stringify(serializable));
      storageWritable = true;
    } catch (_) {
      storageWritable = false;
    }
    updateStorageNotice();
  }

  function updateStorageNotice() {
    elements.storageNotice.hidden = storageWritable;
    elements.storageStatusPill.textContent = storageWritable ? "本地记录" : "仅当前会话";
    elements.storageStatusPill.classList.toggle("is-memory", !storageWritable);
  }

  function requestPersistentStorageOnFirstRun(firstRun) {
    if (!firstRun || !navigator.storage || typeof navigator.storage.persist !== "function") return;
    try {
      const request = navigator.storage.persist();
      if (request && typeof request.catch === "function") request.catch(() => {});
    } catch (_) {
      // Persistence is a best-effort request; failure does not affect the experiment.
    }
  }

  function currentRecord() {
    let record = appState.records[appState.currentSeed];
    if (!record) {
      record = { nextK: 0, saved: [] };
      appState.records[appState.currentSeed] = record;
    }
    return record;
  }

  function formatCount(value) {
    if (!Number.isFinite(value)) return "—";
    return Math.floor(value).toLocaleString("zh-CN");
  }

  function formatRatio(value) {
    return `${Number(value).toFixed(5)}×`;
  }

  function formatDate(value, includeTime) {
    if (!value) return "从未导出";
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "未知";
    try {
      return new Intl.DateTimeFormat("zh-CN", includeTime
        ? { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
        : { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
    } catch (_) {
      return date.toLocaleString();
    }
  }

  function allSavedEntries() {
    const output = [];
    for (const seed of Object.keys(appState.records)) {
      const record = appState.records[seed];
      for (const saved of record.saved) {
        output.push({ seed, k: saved.k, time: saved.时间, note: saved.备注 });
      }
    }
    output.sort((left, right) => {
      const timeDifference = Date.parse(right.time) - Date.parse(left.time);
      return (Number.isFinite(timeDifference) ? timeDifference : 0) || right.k - left.k || left.seed.localeCompare(right.seed);
    });
    return output;
  }

  function renderActiveSeed() {
    elements.currentSeedValue.textContent = appState.currentSeed;
    elements.currentSeedValue.title = appState.currentSeed;
    elements.nextKValue.textContent = formatCount(currentRecord().nextK);
    updateActionAvailability();
  }

  function renderStats() {
    let totalDrawn = 0;
    let totalSaved = 0;
    for (const record of Object.values(appState.records)) {
      totalDrawn += record.nextK;
      totalSaved += record.saved.length;
    }
    elements.totalDrawnValue.textContent = formatCount(totalDrawn);
    elements.totalSavedValue.textContent = formatCount(totalSaved);
    elements.minCompressionValue.textContent = appState.historyMinCompressionRatio === null
      ? "—"
      : formatRatio(appState.historyMinCompressionRatio);
    elements.lastExportValue.textContent = appState.lastExportAt ? formatDate(appState.lastExportAt, false) : "从未导出";

    const lastExportMs = appState.lastExportAt ? Date.parse(appState.lastExportAt) : NaN;
    const shouldRemind = !Number.isFinite(lastExportMs) || Date.now() - lastExportMs > SEVEN_DAYS_MS;
    elements.backupReminder.hidden = !shouldRemind;
    elements.backupReminderText.textContent = !Number.isFinite(lastExportMs)
      ? "从未导出过备份；保存列表和抽取进度只在本机记录。"
      : `上次导出于 ${formatDate(appState.lastExportAt, true)}，已超过 7 天。`;
    updateStorageNotice();
  }

  function renderSavedCounts() {
    let count = 0;
    for (const record of Object.values(appState.records)) count += record.saved.length;
    const label = `${formatCount(count)} 张`;
    elements.savedCountBadge.textContent = label;
    elements.savedNavCount.textContent = formatCount(count);
  }

  function renderAll() {
    renderActiveSeed();
    renderStats();
    renderSavedCounts();
    updateDecisionUi();
  }

  function updateActionAvailability() {
    const isPending = Boolean(pendingCard);
    const canDrawMore = currentRecord().nextK < Core.MAX_K;
    elements.drawButton.disabled = isPending || !canDrawMore;
    elements.replaySeedInput.disabled = isPending;
    elements.replayKInput.disabled = isPending;
    elements.replayButton.disabled = isPending;
    elements.newSeedButton.disabled = isPending;
    elements.openSeedChooserButton.disabled = isPending;
  }

  function updateDecisionUi() {
    const pending = Boolean(pendingCard);
    const canDecide = pending && decisionReady && !saveDialogOpen;
    elements.ignoreButton.disabled = !canDecide;
    elements.saveButton.disabled = !canDecide;
    elements.decisionActions.hidden = !pending || saveDialogOpen;
    elements.saveConfirm.hidden = !saveDialogOpen;
    elements.decisionCountdown.hidden = !pending || decisionReady || saveDialogOpen;
    if (pending && !decisionReady && !saveDialogOpen) {
      const remaining = Math.max(0, pendingCard.readyAt - performance.now());
      const seconds = (remaining / 1000).toFixed(1);
      elements.ignoreButton.textContent = `忽略 · ${seconds}秒`;
      elements.saveButton.textContent = `保存 · ${seconds}秒`;
      elements.decisionCountdown.textContent = `防误触倒计时 ${seconds} 秒…`;
    } else {
      elements.ignoreButton.textContent = "忽略";
      elements.saveButton.textContent = "保存";
    }
    updateActionAvailability();
  }

  function setSampleTag(text, mode) {
    elements.sampleStateTag.textContent = text;
    elements.sampleStateTag.classList.toggle("is-pending", mode === "pending" || mode === "replay");
    elements.sampleStateTag.classList.toggle("is-saved", mode === "saved");
  }

  function paintCanvas(canvas, indices) {
    canvas.width = Core.WIDTH;
    canvas.height = Core.HEIGHT;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("当前浏览器无法创建 Canvas 2D 画布。");
    context.imageSmoothingEnabled = false;
    const image = context.createImageData(Core.WIDTH, Core.HEIGHT);
    const pixels = image.data;
    for (let index = 0, offset = 0; index < indices.length; index += 1, offset += 4) {
      const paletteOffset = indices[index] * 3;
      pixels[offset] = palette[paletteOffset];
      pixels[offset + 1] = palette[paletteOffset + 1];
      pixels[offset + 2] = palette[paletteOffset + 2];
      pixels[offset + 3] = 255;
    }
    context.putImageData(image, 0, 0);
  }

  function showCurrentCard(card, mode, message) {
    currentCard = card;
    paintCanvas(elements.mainCanvas, card.indices);
    elements.canvasPlaceholder.hidden = true;
    elements.sampleLabel.textContent = `样本 k = ${card.k}`;
    elements.sampleSeedLine.textContent = `masterSeed ${card.seed}`;
    elements.sampleModePill.hidden = !mode;
    elements.sampleModePill.textContent = mode === "replay" ? "仅重现" : mode === "saved" ? "已保存" : mode === "ignored" ? "已忽略" : "待决定";
    setSampleTag(mode === "pending" ? "等待选择" : mode === "replay" ? "复现预览" : mode === "saved" ? "已保存" : mode === "ignored" ? "已忽略" : "样本", mode);
    elements.sampleStatus.textContent = message || "";
    elements.adjacencyValue.textContent = `${(Core.horizontalMatchRatio(card.indices) * 100).toFixed(3)}%`;
    if (Number.isFinite(card.compressionRatio)) {
      elements.compressionValue.textContent = formatRatio(card.compressionRatio);
      elements.metricNotice.hidden = true;
    } else if (card.compressionUnavailable) {
      elements.compressionValue.textContent = "不可用";
      elements.metricNotice.textContent = "CompressionStream 不可用，已跳过压缩比。";
      elements.metricNotice.hidden = false;
    } else {
      elements.compressionValue.textContent = "计算中…";
      elements.metricNotice.hidden = true;
    }
    elements.downloadActions.hidden = mode !== "saved";
    if (mode === "saved") elements.downloadHeading.textContent = "样本已保存";
    updateActionAvailability();
  }

  function showBlankSample() {
    currentCard = null;
    elements.canvasPlaceholder.hidden = false;
    const context = elements.mainCanvas.getContext("2d");
    if (context) context.clearRect(0, 0, Core.WIDTH, Core.HEIGHT);
    elements.sampleLabel.textContent = "还没有抽取样本";
    elements.sampleSeedLine.textContent = "点击下方按钮开始一次手动抽样";
    elements.sampleModePill.hidden = true;
    setSampleTag("待抽取", "ready");
    elements.compressionValue.textContent = "—";
    elements.adjacencyValue.textContent = "—";
    elements.metricNotice.hidden = true;
    elements.sampleStatus.textContent = "准备就绪：等待手动抽样。";
    elements.downloadActions.hidden = true;
  }

  async function measureCompression(card, countAsNewDraw, runId) {
    const compressionApi = typeof CompressionStream === "function";
    const canStreamBytes = typeof Blob === "function" && typeof Response === "function";
    if (!compressionApi || !canStreamBytes || typeof Blob.prototype.stream !== "function") {
      card.compressionUnavailable = true;
      if (runId === metricsRunId) {
        elements.compressionValue.textContent = "不可用";
        elements.metricNotice.textContent = "CompressionStream 不可用，已跳过压缩比。";
        elements.metricNotice.hidden = false;
      }
      return null;
    }
    try {
      const stream = new Blob([card.indices]).stream().pipeThrough(new CompressionStream("deflate"));
      const compressed = await new Response(stream).arrayBuffer();
      const ratio = compressed.byteLength / Core.PIXEL_COUNT;
      card.compressionRatio = ratio;
      card.compressionUnavailable = false;
      if (countAsNewDraw && card.historyEpoch === historyEpoch && (appState.historyMinCompressionRatio === null || ratio < appState.historyMinCompressionRatio)) {
        appState.historyMinCompressionRatio = ratio;
        persistState();
        renderStats();
      }
      if (runId === metricsRunId) {
        elements.compressionValue.textContent = formatRatio(ratio);
        elements.metricNotice.hidden = true;
      }
      return ratio;
    } catch (_) {
      card.compressionUnavailable = true;
      if (runId === metricsRunId) {
        elements.compressionValue.textContent = "不可用";
        elements.metricNotice.textContent = "CompressionStream 不可用，已跳过压缩比。";
        elements.metricNotice.hidden = false;
      }
      return null;
    }
  }

  function cancelDecisionTimer() {
    if (decisionTimer !== null) {
      window.clearInterval(decisionTimer);
      decisionTimer = null;
    }
  }

  function startDecisionCountdown(card) {
    cancelDecisionTimer();
    decisionReady = false;
    card.readyAt = performance.now() + 1500;
    updateDecisionUi();
    decisionTimer = window.setInterval(() => {
      if (!pendingCard || pendingCard !== card) {
        cancelDecisionTimer();
        return;
      }
      if (performance.now() >= card.readyAt) {
        decisionReady = true;
        cancelDecisionTimer();
        elements.sampleStatus.textContent = `样本 k = ${card.k} 已生成，请选择「忽略」或「保存」。`;
      }
      updateDecisionUi();
    }, 80);
  }

  function cancelUndoWindow() {
    if (undoTimer !== null) {
      window.clearInterval(undoTimer);
      undoTimer = null;
    }
    undoCard = null;
    undoExpiresAt = 0;
    elements.undoBox.hidden = true;
  }

  function updateUndoCountdown() {
    const remaining = Math.max(0, undoExpiresAt - Date.now());
    if (!undoCard || remaining <= 0) {
      cancelUndoWindow();
      return;
    }
    elements.undoCountdown.textContent = `${Math.ceil(remaining / 1000)} 秒`;
  }

  function startUndoWindow(card) {
    cancelUndoWindow();
    undoCard = { ...card, mode: "pending", readyAt: 0 };
    undoExpiresAt = Date.now() + 10000;
    elements.undoBox.hidden = false;
    updateUndoCountdown();
    undoTimer = window.setInterval(updateUndoCountdown, 120);
  }

  function drawOne() {
    if (pendingCard) return;
    cancelUndoWindow();
    const record = currentRecord();
    const k = record.nextK;
    if (k >= Core.MAX_K) {
      elements.sampleStatus.textContent = "此主种子的序号已达到 JavaScript 安全整数上限；请新建或切换主种子。";
      updateActionAvailability();
      return;
    }
    const seed = appState.currentSeed;
    // Advance and persist before generating, so a refresh can never repeat this index.
    record.nextK = k + 1;
    persistState();
    renderActiveSeed();
    renderStats();

    try {
      const card = { seed, k, indices: Core.generateIndices(seed, k), mode: "pending", readyAt: 0, historyEpoch };
      pendingCard = card;
      saveDialogOpen = false;
      elements.saveConfirm.hidden = true;
      elements.saveNoteInput.value = "";
      elements.downloadActions.hidden = true;
      showCurrentCard(card, "pending", `正在检查样本 k = ${k} 的参考指标…`);
      startDecisionCountdown(card);
      const runId = ++metricsRunId;
      measureCompression(card, true, runId);
    } catch (error) {
      // The index remains consumed because it was written before the computation.
      pendingCard = null;
      decisionReady = false;
      elements.sampleStatus.textContent = `生成失败：${error && error.message ? error.message : "未知错误"}。序号已安全跳过，请再抽一张。`;
      updateDecisionUi();
      updateActionAvailability();
    }
  }

  function ignorePending() {
    if (!pendingCard || !decisionReady || saveDialogOpen) return;
    const ignored = pendingCard;
    cancelDecisionTimer();
    pendingCard = null;
    decisionReady = false;
    saveDialogOpen = false;
    showCurrentCard(ignored, "ignored", `已忽略样本 k = ${ignored.k}。10 秒内可撤销；序号不会回退。`);
    elements.decisionActions.hidden = true;
    elements.decisionCountdown.hidden = true;
    elements.saveConfirm.hidden = true;
    elements.downloadActions.hidden = true;
    startUndoWindow(ignored);
    renderAll();
  }

  function undoIgnore() {
    if (!undoCard || Date.now() > undoExpiresAt || pendingCard) return;
    const restored = { ...undoCard, mode: "pending", readyAt: 0 };
    cancelUndoWindow();
    pendingCard = restored;
    decisionReady = true;
    saveDialogOpen = false;
    showCurrentCard(restored, "pending", `已撤销忽略：样本 k = ${restored.k} 已恢复，等待你的选择。`);
    updateDecisionUi();
  }

  function openSaveConfirmation() {
    if (!pendingCard || !decisionReady) return;
    saveDialogOpen = true;
    elements.saveNoteInput.value = "";
    updateDecisionUi();
    window.setTimeout(() => elements.saveNoteInput.focus({ preventScroll: true }), 50);
  }

  function savePending() {
    if (!pendingCard || !decisionReady || !saveDialogOpen) return;
    const card = pendingCard;
    const record = appState.records[card.seed];
    if (!record) {
      elements.sampleStatus.textContent = "找不到这张图对应的主种子记录，暂时无法保存。";
      return;
    }
    const note = elements.saveNoteInput.value.trim().slice(0, 240);
    const existing = record.saved.find((saved) => saved.k === card.k);
    const savedEntry = existing || { k: card.k, 时间: new Date().toISOString(), 备注: note };
    if (existing && note) existing.备注 = note;
    if (!existing) record.saved.push(savedEntry);
    record.saved.sort((left, right) => left.k - right.k);
    persistState();
    cancelDecisionTimer();
    cancelUndoWindow();
    pendingCard = null;
    decisionReady = false;
    saveDialogOpen = false;
    elements.saveConfirm.hidden = true;
    elements.decisionActions.hidden = true;
    showCurrentCard({ ...card, mode: "saved" }, "saved", `已保存样本 k = ${card.k}。可以下载 PNG，也可以继续抽下一张。`);
    elements.downloadActions.hidden = false;
    elements.downloadHeading.textContent = "样本已保存";
    renderAll();
    renderSavedList();
  }

  function closeSaveConfirmation() {
    if (!saveDialogOpen) return;
    saveDialogOpen = false;
    elements.saveConfirm.hidden = true;
    elements.decisionActions.hidden = !pendingCard;
    updateDecisionUi();
  }

  function setMetricsForReplay(card) {
    const runId = ++metricsRunId;
    measureCompression(card, false, runId);
  }

  function verifyReproducibility() {
    const seed = currentCard ? currentCard.seed : appState.currentSeed;
    const k = currentCard ? currentCard.k : currentRecord().nextK;
    try {
      const first = Core.generateIndices(seed, k);
      const second = Core.generateIndices(seed, k);
      const passed = Core.equalBytes(first, second);
      elements.sampleStatus.textContent = passed
        ? `校验通过：masterSeed ${seed}、k = ${k} 的两次生成结果完全一致。未增加抽取数。`
        : `校验失败：masterSeed ${seed}、k = ${k} 的结果不一致。`;
    } catch (error) {
      elements.sampleStatus.textContent = `校验无法完成：${error && error.message ? error.message : "未知错误"}`;
    }
  }

  function replayImage(event) {
    event.preventDefault();
    if (pendingCard) {
      elements.sampleStatus.textContent = "请先决定当前样本，再切换到复现预览。";
      return;
    }
    let seed;
    let k;
    try {
      seed = Core.normalizeSeed(elements.replaySeedInput.value);
      const rawK = elements.replayKInput.value.trim();
      if (!/^[0-9]+$/.test(rawK)) throw new RangeError("序号 k 必须是非负整数。");
      k = Number(rawK);
      if (!Number.isSafeInteger(k)) throw new RangeError("序号 k 超过可精确表示的范围。");
    } catch (error) {
      elements.sampleStatus.textContent = error && error.message ? error.message : "主种子或序号无效。";
      return;
    }
    cancelUndoWindow();
    try {
      const card = { seed, k, indices: Core.generateIndices(seed, k), mode: "replay", readyAt: 0 };
      pendingCard = null;
      decisionReady = false;
      saveDialogOpen = false;
      elements.saveConfirm.hidden = true;
      elements.decisionActions.hidden = true;
      elements.decisionCountdown.hidden = true;
      elements.downloadActions.hidden = true;
      showCurrentCard(card, "replay", `已复现 masterSeed ${seed}、k = ${k}。此预览不计入抽取统计。`);
      setMetricsForReplay(card);
      updateDecisionUi();
    } catch (error) {
      elements.sampleStatus.textContent = `无法复现：${error && error.message ? error.message : "参数无效"}`;
    }
  }

  function openSeedChooser(defaultSeed) {
    if (pendingCard) {
      elements.sampleStatus.textContent = "请先决定当前样本，再切换主种子。";
      return;
    }
    const seeds = Object.keys(appState.records).sort((left, right) => {
      const difference = appState.records[right].nextK - appState.records[left].nextK;
      return difference || left.localeCompare(right);
    });
    if (!seeds.length) {
      elements.sampleStatus.textContent = "还没有主种子记录。";
      return;
    }
    elements.seedChoiceSelect.replaceChildren();
    for (const seed of seeds) {
      const record = appState.records[seed];
      const option = document.createElement("option");
      option.value = seed;
      option.textContent = `${seed}　·　nextK ${formatCount(record.nextK)}　·　保存 ${formatCount(record.saved.length)}`;
      elements.seedChoiceSelect.append(option);
    }
    const preferred = seeds.includes(defaultSeed) ? defaultSeed : appState.currentSeed;
    elements.seedChoiceSelect.value = preferred;
    openModal(elements.seedChooserModal);
  }

  function confirmSeedChoice() {
    const seed = elements.seedChoiceSelect.value;
    if (!appState.records[seed]) return;
    appState.currentSeed = seed;
    persistState();
    renderActiveSeed();
    renderStats();
    closeModal(elements.seedChooserModal);
    elements.sampleStatus.textContent = `已切换主种子；下一张将从 k = ${currentRecord().nextK} 开始。`;
  }

  function createNewSeed() {
    if (pendingCard) return;
    try {
      let seed = Core.createMasterSeed(window.crypto);
      let attempts = 0;
      while (appState.records[seed] && attempts < 8) {
        seed = Core.createMasterSeed(window.crypto);
        attempts += 1;
      }
      if (appState.records[seed]) throw new Error("连续生成的种子均已存在，请再试一次。");
      appState.records[seed] = { nextK: 0, saved: [] };
      appState.currentSeed = seed;
      persistState();
      renderAll();
      elements.sampleStatus.textContent = "已创建新的随机主种子；下一张从 k = 0 开始。";
    } catch (error) {
      elements.sampleStatus.textContent = `无法创建主种子：${error && error.message ? error.message : "未知错误"}`;
    }
  }

  async function copyCurrentSeed() {
    const value = appState.currentSeed;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("系统未允许复制，请长按种子文本手动复制。");
      }
      elements.sampleStatus.textContent = "主种子已复制。";
    } catch (_) {
      elements.sampleStatus.textContent = "复制失败；请长按主种子文本手动复制。";
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function downloadDataUrl(dataUrl, filename) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.rel = "noopener";
    document.body.append(link);
    link.click();
    link.remove();
  }

  function downloadCardPng(card, scale) {
    if (!card || !(card.indices instanceof Uint8Array)) return;
    const pixelCanvas = document.createElement("canvas");
    paintCanvas(pixelCanvas, card.indices);
    let outputCanvas = pixelCanvas;
    if (scale === 4) {
      outputCanvas = document.createElement("canvas");
      outputCanvas.width = Core.WIDTH * 4;
      outputCanvas.height = Core.HEIGHT * 4;
      const context = outputCanvas.getContext("2d");
      if (!context) {
        elements.sampleStatus.textContent = "当前浏览器无法建立 PNG 导出画布。";
        return;
      }
      context.imageSmoothingEnabled = false;
      context.drawImage(pixelCanvas, 0, 0, outputCanvas.width, outputCanvas.height);
    }
    const filename = `random-pixels-${card.seed}-k${card.k}${scale === 4 ? "-4x" : ""}.png`;
    try {
      if (typeof outputCanvas.toBlob === "function") {
        outputCanvas.toBlob((blob) => {
          if (!blob) {
            try {
              downloadDataUrl(outputCanvas.toDataURL("image/png"), filename);
            } catch (_) {
              elements.sampleStatus.textContent = "PNG 导出失败，请稍后重试。";
            }
            return;
          }
          try {
            downloadBlob(blob, filename);
            elements.sampleStatus.textContent = `已准备 PNG：${filename}`;
          } catch (_) {
            elements.sampleStatus.textContent = "PNG 已生成，但浏览器阻止了下载。请尝试长按图片或在分享菜单中保存。";
          }
        }, "image/png");
      } else {
        downloadDataUrl(outputCanvas.toDataURL("image/png"), filename);
        elements.sampleStatus.textContent = `已准备 PNG：${filename}`;
      }
    } catch (_) {
      elements.sampleStatus.textContent = "PNG 导出失败，请稍后重试。";
    }
  }

  function savedEntryFor(seed, k) {
    const record = appState.records[seed];
    if (!record) return null;
    return record.saved.find((entry) => entry.k === k) || null;
  }

  function makeSavedItem(item) {
    const article = document.createElement("article");
    article.className = "saved-item";
    article.dataset.seed = item.seed;
    article.dataset.k = String(item.k);

    const thumbWrap = document.createElement("div");
    thumbWrap.className = "saved-thumb-wrap";
    const canvas = document.createElement("canvas");
    canvas.width = Core.WIDTH;
    canvas.height = Core.HEIGHT;
    canvas.className = "saved-thumb";
    canvas.dataset.seed = item.seed;
    canvas.dataset.k = String(item.k);
    canvas.setAttribute("aria-label", `主种子 ${item.seed} 的第 ${item.k} 张保存样本缩略图`);
    const loading = document.createElement("span");
    loading.className = "thumb-loading";
    loading.textContent = "生成缩略图…";
    thumbWrap.append(canvas, loading);

    const copy = document.createElement("div");
    copy.className = "saved-copy";
    const top = document.createElement("div");
    top.className = "saved-item-top";
    const title = document.createElement("h3");
    title.textContent = "随机样本";
    const index = document.createElement("span");
    index.className = "saved-k";
    index.textContent = `k=${item.k}`;
    top.append(title, index);
    const seed = document.createElement("code");
    seed.className = "saved-seed";
    seed.textContent = `${item.seed.slice(0, 10)}…${item.seed.slice(-8)}`;
    seed.title = item.seed;
    const note = document.createElement("p");
    note.className = "saved-note";
    note.textContent = item.note ? `「${item.note}」` : "无备注";
    const time = document.createElement("time");
    time.className = "saved-time";
    time.dateTime = item.time;
    time.textContent = formatDate(item.time, true);

    const actions = document.createElement("div");
    actions.className = "saved-item-actions";
    const open = document.createElement("button");
    open.type = "button";
    open.dataset.action = "open";
    open.textContent = "查看";
    const download = document.createElement("button");
    download.type = "button";
    download.dataset.action = "download";
    download.textContent = "PNG 320×180";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.dataset.action = "edit";
    edit.textContent = "改备注";
    actions.append(open, download, edit);
    copy.append(top, seed, note, time, actions);
    article.append(thumbWrap, copy);
    return article;
  }

  function renderOneThumbnail(canvas) {
    if (canvas.dataset.rendered === "true") return;
    try {
      const seed = Core.normalizeSeed(canvas.dataset.seed);
      const k = Number(canvas.dataset.k);
      const indices = Core.generateIndices(seed, k);
      paintCanvas(canvas, indices);
      canvas.dataset.rendered = "true";
      const loading = canvas.parentElement.querySelector(".thumb-loading");
      if (loading) loading.remove();
    } catch (_) {
      const loading = canvas.parentElement.querySelector(".thumb-loading");
      if (loading) loading.textContent = "縮略圖無法生成";
    }
  }

  function renderSavedList() {
    if (thumbObserver) {
      thumbObserver.disconnect();
      thumbObserver = null;
    }
    elements.savedList.replaceChildren();
    const items = allSavedEntries();
    elements.savedEmpty.hidden = items.length !== 0;
    elements.savedList.hidden = items.length === 0;
    for (const item of items) elements.savedList.append(makeSavedItem(item));

    const canvases = Array.from(elements.savedList.querySelectorAll(".saved-thumb"));
    if (typeof IntersectionObserver === "function") {
      thumbObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          renderOneThumbnail(entry.target);
          thumbObserver.unobserve(entry.target);
        }
      }, { root: null, rootMargin: "180px 0px", threshold: 0.01 });
      for (const canvas of canvases) thumbObserver.observe(canvas);
    } else {
      for (const canvas of canvases) renderOneThumbnail(canvas);
    }
    renderSavedCounts();
  }

  function findSaved(seed, k) {
    const record = appState.records[seed];
    if (!record) return null;
    const entry = savedEntryFor(seed, k);
    return entry ? { seed, k, entry } : null;
  }

  function openSavedDetail(seed, k, focusNote) {
    const found = findSaved(seed, k);
    if (!found) return;
    try {
      const card = { seed, k, indices: Core.generateIndices(seed, k), mode: "saved" };
      paintCanvas(elements.detailCanvas, card.indices);
      detailRecord = { seed, k, card };
      elements.detailMeta.textContent = `masterSeed ${seed} · k = ${k} · 保存于 ${formatDate(found.entry.时间, true)}`;
      elements.detailNoteInput.value = found.entry.备注 || "";
      elements.detailStatus.textContent = "";
      elements.deleteConfirmPanel.hidden = true;
      elements.requestDeleteSavedButton.hidden = false;
      openModal(elements.detailModal);
      if (focusNote) window.setTimeout(() => elements.detailNoteInput.focus({ preventScroll: true }), 80);
    } catch (error) {
      elements.backupStatus.textContent = `缩略图生成失败：${error && error.message ? error.message : "未知错误"}`;
    }
  }

  function saveDetailNote() {
    if (!detailRecord) return;
    const entry = savedEntryFor(detailRecord.seed, detailRecord.k);
    if (!entry) return;
    entry.备注 = elements.detailNoteInput.value.trim().slice(0, 240);
    persistState();
    elements.detailStatus.textContent = "备注已更新。";
    renderSavedList();
  }

  function deleteDetailRecord() {
    if (!detailRecord) return;
    const record = appState.records[detailRecord.seed];
    if (!record) return;
    record.saved = record.saved.filter((entry) => entry.k !== detailRecord.k);
    persistState();
    closeModal(elements.detailModal);
    detailRecord = null;
    renderSavedList();
    renderStats();
  }

  function showPage(pageId) {
    const showExperiment = pageId === "experimentPage";
    elements.experimentPage.hidden = !showExperiment;
    elements.savedPage.hidden = showExperiment;
    for (const button of document.querySelectorAll(".nav-button")) {
      const active = button.dataset.page === pageId;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
    if (!showExperiment) renderSavedList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openModal(modal) {
    if (!modal) return;
    lastFocusBeforeModal = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const focusable = modal.querySelector("button:not([disabled]), input:not([disabled]), select:not([disabled])");
    if (focusable) window.setTimeout(() => focusable.focus({ preventScroll: true }), 30);
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    if (document.querySelectorAll(".modal-backdrop:not([hidden])").length === 0) document.body.style.overflow = "";
    if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === "function") {
      try { lastFocusBeforeModal.focus({ preventScroll: true }); } catch (_) { lastFocusBeforeModal.focus(); }
    }
  }

  function closeTopModal() {
    if (!elements.detailModal.hidden) closeModal(elements.detailModal);
    else if (!elements.seedChooserModal.hidden) closeModal(elements.seedChooserModal);
    else if (!elements.clearRecordsModal.hidden) closeModal(elements.clearRecordsModal);
  }

  function triggerExport() {
    const exportedAt = new Date().toISOString();
    appState.lastExportAt = exportedAt;
    persistState();
    renderStats();
    const payload = {
      format: "infinite-monkey-lab",
      formatVersion: 1,
      exportedAt,
      records: appState.records,
      historyMinCompressionRatio: appState.historyMinCompressionRatio,
    };
    const fileName = `infinite-monkey-records-${exportedAt.slice(0, 10)}.json`;
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
      downloadBlob(blob, fileName);
      elements.backupStatus.textContent = `已导出 ${fileName}。建议把 JSON 另存到安全位置。`;
    } catch (_) {
      elements.backupStatus.textContent = "导出失败；请检查浏览器下载权限后重试。";
    }
  }

  function mergeImportedRecords(incoming) {
    for (const seed of Object.keys(incoming)) {
      const imported = incoming[seed];
      const existing = appState.records[seed];
      if (!existing) {
        appState.records[seed] = {
          nextK: imported.nextK,
          saved: imported.saved.map((entry) => ({ ...entry })),
        };
        continue;
      }
      existing.nextK = Math.max(existing.nextK, imported.nextK);
      const byK = new Map(existing.saved.map((entry) => [entry.k, entry]));
      for (const entry of imported.saved) {
        const duplicate = byK.get(entry.k);
        if (!duplicate) {
          const copy = { ...entry };
          existing.saved.push(copy);
          byK.set(copy.k, copy);
        } else {
          if (!duplicate.备注 && entry.备注) duplicate.备注 = entry.备注;
          if (!duplicate.时间 && entry.时间) duplicate.时间 = entry.时间;
        }
      }
      existing.saved.sort((left, right) => left.k - right.k);
      const maxSavedK = existing.saved.reduce((maximum, entry) => Math.max(maximum, entry.k), -1);
      if (maxSavedK >= existing.nextK) existing.nextK = maxSavedK + 1;
    }
  }

  async function importFile(file) {
    if (pendingCard) {
      elements.backupStatus.textContent = "请先决定当前样本，再导入记录。";
      return;
    }
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!isPlainObject(payload) || !isPlainObject(payload.records)) throw new TypeError("文件格式不符：找不到 records 对象。");
      const incoming = normalizeRecords(payload.records, true);
      if (!Object.keys(incoming).length) throw new TypeError("备份中没有可导入的主种子记录。");
      const incomingMin = payload.historyMinCompressionRatio ?? payload.historyMinRatio;
      const parsedMin = incomingMin === null || incomingMin === undefined ? null : Number(incomingMin);
      if (parsedMin !== null && (!Number.isFinite(parsedMin) || parsedMin < 0)) throw new TypeError("备份中的历史最小压缩比无效。");
      mergeImportedRecords(incoming);
      if (parsedMin !== null) {
        appState.historyMinCompressionRatio = appState.historyMinCompressionRatio === null
          ? parsedMin
          : Math.min(appState.historyMinCompressionRatio, parsedMin);
      }
      const defaultSeed = defaultSeedFromRecords(appState.records);
      if (defaultSeed) appState.currentSeed = defaultSeed;
      persistState();
      renderAll();
      renderSavedList();
      elements.backupStatus.textContent = "导入并合并完成。请选择要继续使用的主种子；默认已选 nextK 最大的一个。";
      openSeedChooser(defaultSeed);
    } catch (error) {
      elements.backupStatus.textContent = `导入失败：${error && error.message ? error.message : "JSON 文件无法读取。"}`;
    } finally {
      elements.importFileInput.value = "";
    }
  }

  function openClearConfirmation() {
    if (pendingCard) {
      elements.backupStatus.textContent = "请先决定当前样本，再清空记录。";
      return;
    }
    elements.clearStepOne.hidden = false;
    elements.clearStepTwo.hidden = true;
    openModal(elements.clearRecordsModal);
  }

  function clearAllRecords() {
    try {
      const seed = Core.createMasterSeed(window.crypto);
      appState = newEmptyState(seed);
      currentCard = null;
      undoCard = null;
      pendingCard = null;
      metricsRunId += 1;
      historyEpoch += 1;
      cancelUndoWindow();
      cancelDecisionTimer();
      decisionReady = false;
      saveDialogOpen = false;
      elements.saveConfirm.hidden = true;
      persistState();
      showBlankSample();
      renderAll();
      renderSavedList();
      closeModal(elements.clearRecordsModal);
      showPage("experimentPage");
      elements.backupStatus.textContent = "所有本机记录已清空，并创建了一个新的随机主种子。";
    } catch (error) {
      elements.backupStatus.textContent = `无法完成清空：${error && error.message ? error.message : "无法生成新主种子。"}`;
    }
  }

  async function requestWorkerVersion(worker) {
    if (!worker || typeof MessageChannel !== "function") return null;
    return new Promise((resolve) => {
      let finished = false;
      const channel = new MessageChannel();
      const timeout = window.setTimeout(() => {
        if (finished) return;
        finished = true;
        channel.port1.close();
        resolve(null);
      }, 1200);
      channel.port1.onmessage = (event) => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeout);
        channel.port1.close();
        resolve(event.data && typeof event.data.version === "string" ? event.data.version : null);
      };
      try {
        worker.postMessage({ type: "GET_VERSION" }, [channel.port2]);
      } catch (_) {
        window.clearTimeout(timeout);
        channel.port1.close();
        finished = true;
        resolve(null);
      }
    });
  }

  async function syncDisplayedVersion(registration) {
    const worker = registration && (registration.active || registration.waiting || registration.installing);
    const version = await requestWorkerVersion(worker);
    if (version) elements.versionBadge.textContent = `v${version}`;
  }

  function registerServiceWorker() {
    elements.versionBadge.textContent = `v${FALLBACK_VERSION}`;
    if (!("serviceWorker" in navigator)) return;
    try {
      navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" })
        .then((registration) => {
          syncDisplayedVersion(registration);
          navigator.serviceWorker.ready.then(syncDisplayedVersion).catch(() => {});
          registration.addEventListener("updatefound", () => {
            const installing = registration.installing;
            if (!installing) return;
            installing.addEventListener("statechange", () => {
              if (installing.state === "activated") syncDisplayedVersion(registration);
            });
          });
        })
        .catch(() => {
          // The page remains usable in browsers or local previews without service workers.
        });
    } catch (_) {
      // A secure origin is required for service workers; the app itself still works online.
    }
  }

  function detectStandaloneMode() {
    let displayModeStandalone = false;
    try {
      displayModeStandalone = Boolean(window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
    } catch (_) {
      displayModeStandalone = false;
    }
    const isStandalone = window.navigator.standalone === true || displayModeStandalone;
    elements.standaloneHint.hidden = isStandalone;
  }

  function bindEvents() {
    elements.closeStandaloneHint.addEventListener("click", () => { elements.standaloneHint.hidden = true; });
    elements.drawButton.addEventListener("click", drawOne);
    elements.verifyButton.addEventListener("click", verifyReproducibility);
    elements.ignoreButton.addEventListener("click", ignorePending);
    elements.saveButton.addEventListener("click", openSaveConfirmation);
    elements.cancelSaveButton.addEventListener("click", closeSaveConfirmation);
    elements.confirmSaveButton.addEventListener("click", savePending);
    elements.undoButton.addEventListener("click", undoIgnore);
    elements.copySeedButton.addEventListener("click", copyCurrentSeed);
    elements.newSeedButton.addEventListener("click", createNewSeed);
    elements.openSeedChooserButton.addEventListener("click", () => openSeedChooser(appState.currentSeed));
    elements.confirmSeedChoiceButton.addEventListener("click", confirmSeedChoice);
    elements.replayForm.addEventListener("submit", replayImage);
    elements.downloadOriginalButton.addEventListener("click", () => downloadCardPng(currentCard, 1));
    elements.download4xButton.addEventListener("click", () => downloadCardPng(currentCard, 4));
    elements.exportButton.addEventListener("click", triggerExport);
    elements.importButton.addEventListener("click", () => elements.importFileInput.click());
    elements.importFileInput.addEventListener("change", (event) => importFile(event.target.files && event.target.files[0]));
    elements.openClearModalButton.addEventListener("click", openClearConfirmation);
    elements.continueClearButton.addEventListener("click", () => {
      elements.clearStepOne.hidden = true;
      elements.clearStepTwo.hidden = false;
    });
    elements.backFromClearButton.addEventListener("click", () => {
      elements.clearStepOne.hidden = false;
      elements.clearStepTwo.hidden = true;
    });
    elements.confirmClearButton.addEventListener("click", clearAllRecords);

    for (const button of document.querySelectorAll(".nav-button")) {
      button.addEventListener("click", () => showPage(button.dataset.page));
    }
    elements.goToExperimentButton.addEventListener("click", () => showPage("experimentPage"));
    elements.savedList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const article = button.closest(".saved-item");
      if (!article) return;
      const seed = article.dataset.seed;
      const k = Number(article.dataset.k);
      if (button.dataset.action === "open") openSavedDetail(seed, k, false);
      if (button.dataset.action === "edit") openSavedDetail(seed, k, true);
      if (button.dataset.action === "download") {
        try {
          const card = { seed, k, indices: Core.generateIndices(seed, k) };
          downloadCardPng(card, 1);
        } catch (_) {
          elements.backupStatus.textContent = "无法重新生成这张样本。";
        }
      }
    });

    elements.closeDetailButton.addEventListener("click", () => closeModal(elements.detailModal));
    elements.saveDetailNoteButton.addEventListener("click", saveDetailNote);
    elements.detailDownloadOriginalButton.addEventListener("click", () => {
      if (detailRecord) downloadCardPng(detailRecord.card, 1);
    });
    elements.detailDownload4xButton.addEventListener("click", () => {
      if (detailRecord) downloadCardPng(detailRecord.card, 4);
    });
    elements.requestDeleteSavedButton.addEventListener("click", () => {
      elements.deleteConfirmPanel.hidden = false;
      elements.requestDeleteSavedButton.hidden = true;
    });
    elements.cancelDeleteSavedButton.addEventListener("click", () => {
      elements.deleteConfirmPanel.hidden = true;
      elements.requestDeleteSavedButton.hidden = false;
    });
    elements.confirmDeleteSavedButton.addEventListener("click", deleteDetailRecord);

    for (const closeButton of document.querySelectorAll("[data-close-modal]")) {
      closeButton.addEventListener("click", () => closeModal($(closeButton.dataset.closeModal)));
    }
    for (const modal of document.querySelectorAll(".modal-backdrop")) {
      modal.addEventListener("click", (event) => {
        if (event.target !== modal) return;
        if (modal === elements.clearRecordsModal) {
          closeModal(modal);
          return;
        }
        closeModal(modal);
      });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeTopModal();
    });
    elements.detailModal.addEventListener("close", () => { detailRecord = null; });
  }

  function init() {
    if (!Core) {
      elements.startupNotice.hidden = false;
      elements.startupNotice.textContent = "应用核心脚本无法加载。请确认 index.html、core.js 和 app.js 都已上传到同一目录。";
      elements.drawButton.disabled = true;
      return;
    }
    const loaded = readLocalState();
    try {
      appState = loaded.state || newEmptyState(Core.createMasterSeed(window.crypto));
    } catch (error) {
      elements.startupNotice.hidden = false;
      elements.startupNotice.textContent = error && error.message ? error.message : "无法创建主种子，请使用支持加密随机数的 HTTPS 浏览器打开。";
      elements.drawButton.disabled = true;
      return;
    }
    if (loaded.error) {
      elements.startupNotice.hidden = false;
      elements.startupNotice.textContent = loaded.error;
    }
    if (loaded.firstRun || !loaded.state) persistState();
    requestPersistentStorageOnFirstRun(loaded.firstRun);
    bindEvents();
    detectStandaloneMode();
    registerServiceWorker();
    updateStorageNotice();
    renderAll();
    showBlankSample();
    renderSavedCounts();
    if (loaded.error) renderStats();
  }

  init();
})();
