const archiveState = { data: [] };
const escapeArchiveText = value => String(value == null ? "" : value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

function archiveBadgeClass(category) {
  return String(category || "").toLowerCase().replace(/\s+/g, "-");
}

function archiveDateLabel(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? (value || "-") : date.toISOString().slice(0, 10);
}

function renderArchives() {
  const body = document.getElementById("tb");
  const query = document.getElementById("search").value.trim().toLowerCase();
  const category = document.getElementById("kategori").value;
  const filtered = archiveState.data.filter(item => {
    const searchable = `${item.nomor || ""} ${item.judul || ""} ${item.keterangan || ""}`.toLowerCase();
    return searchable.includes(query) && (!category || item.kategori === category);
  });

  if (!filtered.length) {
    body.innerHTML = '<tr><td colspan="4" class="empty-state">Tidak ada arsip yang sesuai.</td></tr>';
    return;
  }

  body.innerHTML = filtered.map(item => {
    const badgeClass = archiveBadgeClass(item.kategori);
    return `<tr>
      <td class="archive-number">${escapeArchiveText(item.nomor || "-")}</td>
      <td class="archive-title-cell"><button class="archive-title-button" type="button" data-file="${escapeArchiveText(item.file)}"><strong>${escapeArchiveText(item.judul || "Tanpa judul")}</strong></button></td>
      <td><span class="category-badge category-${badgeClass}">${escapeArchiveText(item.kategori || "Arsip")}</span></td>
      <td>${escapeArchiveText(archiveDateLabel(item.tanggal))}</td>
    </tr>`;
  }).join("");

  body.querySelectorAll(".archive-title-button").forEach(button => {
    button.addEventListener("click", () => {
      const url = button.dataset.file;
      if (!url) return notify("Preview tidak tersedia", "Dokumen belum memiliki link file.", "warning");
      document.getElementById("pdfFrame").src = url;
      bootstrap.Modal.getOrCreateInstance(document.getElementById("previewModal")).show();
    });
  });
}

async function loadArchives() {
  try {
    archiveState.data = await api.list();
    renderArchives();
  } catch (error) {
    document.getElementById("tb").innerHTML = `<tr><td colspan="4" class="empty-state">${escapeArchiveText(error.message)}</td></tr>`;
  }
}

document.getElementById("search").addEventListener("input", renderArchives)
document.getElementById("kategori").addEventListener("change", renderArchives);
loadArchives();
