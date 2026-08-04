const form = document.querySelector("#apply-form");
const statusEl = document.querySelector("#form-status");
const summaryWrap = document.querySelector("#summary-wrap");
const summaryEl = document.querySelector("#application-summary");
const copyButton = document.querySelector("#copy-summary");

const counterFields = ["use_case", "notes"];

function updateCounter(fieldName) {
  const field = form.elements[fieldName];
  const counter = document.querySelector(`[data-counter-for="${fieldName}"]`);
  if (!field || !counter) return;
  counter.textContent = `${field.value.length} / ${field.maxLength}`;
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function clean(value) {
  return String(value || "").trim();
}

function buildSummary(data) {
  return [
    "ClassHub 免費使用申請",
    "",
    `申請人稱呼：${data.applicantLabel}`,
    `Email：${data.email}`,
    `單位類型：${data.organizationType}`,
    "",
    "使用場景簡述：",
    data.useCase,
    "",
    "補充說明：",
    data.notes || "無",
    "",
    "申請確認：",
    "- 已了解 ClassHub 採申請制，帳號需經審核後才會開通。",
    "- 已了解免費服務有學生數、發布次數、圖片、資料保留與帳號期限限制。",
    "- 已了解 ClassHub 不應作為緊急通知、即時救援或唯一正式通知管道。",
    "- 已了解重要資料需自行備份，帳號或資料移除後可能無法復原。",
  ].join("\n");
}

counterFields.forEach((fieldName) => {
  const field = form.elements[fieldName];
  field?.addEventListener("input", () => updateCounter(fieldName));
  updateCounter(fieldName);
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    counterFields.forEach(updateCounter);
    summaryEl.value = "";
    summaryWrap.classList.add("hidden");
    copyButton.classList.add("hidden");
    setStatus("");
  }, 0);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setStatus("");

  if (clean(form.elements.website.value)) {
    setStatus("申請無法送出，請重新整理頁面後再試。", true);
    return;
  }

  if (!form.reportValidity()) {
    setStatus("請完成必填欄位與確認事項。", true);
    return;
  }

  const data = {
    applicantLabel: clean(form.elements.applicant_label.value),
    email: clean(form.elements.email.value),
    organizationType: clean(form.elements.organization_type.value),
    useCase: clean(form.elements.use_case.value),
    notes: clean(form.elements.notes.value),
  };

  summaryEl.value = buildSummary(data);
  summaryWrap.classList.remove("hidden");
  copyButton.classList.remove("hidden");
  setStatus("申請內容已產生。請複製摘要後交給 ClassHub 指定申請窗口。");
  summaryEl.focus();
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(summaryEl.value);
    setStatus("已複製申請摘要。");
  } catch {
    summaryEl.select();
    setStatus("瀏覽器未允許自動複製，請手動複製申請摘要。", true);
  }
});
