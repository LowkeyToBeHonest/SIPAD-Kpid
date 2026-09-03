let auditData = [];
const auditText = value => String(value == null ? "" : value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[character]));

function formatAuditTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? (value || "-") : date.toISOString().replace("T", " ").slice(0, 19);
}

function renderAudit() {
  const query = document.getElementById("auditSearch").value.trim().toLowerCase();
  const status = document.getElementById("auditStatus").value;
  const rows = auditData.filter(item => `${item.user || ""} ${item.aksi || ""} ${item.nomor || ""}`.toLowerCase().includes(query) && (!status || status === "Berhasil"));
  const body = document.getElementById("tbody");
  document.getElementById("auditTotal").textContent = auditData.length;
  document.getElementById("auditSuccess").textContent = auditData.length;
  document.getElementById("auditFailed").textContent = 0;
  body.innerHTML = rows.length ? rows.map(item => `<tr>
    <td><span class="audit-user-avatar">${auditText((item.user || "S").charAt(0).toUpperCase())}</span><strong>${auditText(item.user || "SYSTEM")}</strong></td>
    <td class="audit-action">${auditText(item.aksi || "-")}</td>
    <td class="audit-detail">${item.nomor ? `Aktivitas arsip<br><span>${auditText(item.nomor)}</span>` : "Aktivitas sistem"}</td>
    <td>${auditText(formatAuditTime(item.waktu))}</td>
    <td class="audit-ip">-</td>
    <td><span class="audit-status">♢ &nbsp;Berhasil</span></td>
  </tr>`).join("") : '<tr><td colspan="6" class="empty-state">Tidak ada aktivitas yang sesuai.</td></tr>';
}

async function loadAudit() {
  const body = document.getElementById("tbody");
  try { auditData = await api.audit(); renderAudit(); }
  catch (error) { body.innerHTML = `<tr><td colspan="6" class="empty-state">${auditText(error.message)}</td></tr>`; }
}

document.getElementById("auditSearch").addEventListener("input", renderAudit);
document.getElementById("auditStatus").addEventListener("change", renderAudit);
loadAudit();
