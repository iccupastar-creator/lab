/**
 * Main Application Logic for Apple Puree Lab Quality Report Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const form = document.getElementById('blankForm');
  const organoAppearanceInput = document.getElementById('organoAppearance');
  const organoTasteInput = document.getElementById('organoTaste');
  const organoColorInput = document.getElementById('organoColor');
  const organoImpuritiesInput = document.getElementById('organoImpurities');

  const brixInput = document.getElementById('brixValue');
  const acidityInput = document.getElementById('acidityValue');
  const phInput = document.getElementById('phValue');
  const viscosityInput = document.getElementById('viscosityValue');
  const batchInput = document.getElementById('batchNumber');
  const technicianInput = document.getElementById('technician');

  const btnReset = document.getElementById('btnReset');
  const previewCard = document.getElementById('previewCard');
  const blankCanvas = document.getElementById('blankCanvas');
  const blankImage = document.getElementById('blankImage');
  const previewTimestamp = document.getElementById('previewTimestamp');

  const btnSaveJpg = document.getElementById('btnSaveJpg');
  const btnSaveDocx = document.getElementById('btnSaveDocx');
  const btnShare = document.getElementById('btnShare');
  const btnCopy = document.getElementById('btnCopy');

  // History Elements
  const btnOpenHistory = document.getElementById('btnOpenHistory');
  const btnCloseHistoryModal = document.getElementById('btnCloseHistoryModal');
  const historyModal = document.getElementById('historyModal');
  const historyList = document.getElementById('historyList');
  const historySearch = document.getElementById('historySearch');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnClearHistory = document.getElementById('btnClearHistory');

  // Image Modal Elements
  const imageModal = document.getElementById('imageModal');
  const modalPreviewImg = document.getElementById('modalPreviewImg');
  const btnCloseImageModal = document.getElementById('btnCloseImageModal');
  const btnModalClose = document.getElementById('btnModalClose');
  const btnModalDownload = document.getElementById('btnModalDownload');

  // Toast Element
  const toast = document.getElementById('toast');

  // Current State
  let currentData = null;

  /**
   * Show Toast Notification
   * @param {string} text 
   * @param {number} duration 
   */
  function showToast(text, duration = 3000) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.remove('hidden');
    
    if (window._toastTimeout) {
      clearTimeout(window._toastTimeout);
    }
    window._toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, duration);
  }

  /**
   * Ensure data is generated before actions
   * @returns {boolean}
   */
  function ensureData() {
    if (currentData) return true;

    const brix = parseFloat(brixInput.value);
    const acidity = parseFloat(acidityInput.value);
    const ph = parseFloat(phInput.value);
    const viscosity = parseFloat(viscosityInput.value);

    if (isNaN(brix) || isNaN(acidity) || isNaN(ph) || isNaN(viscosity)) {
      showToast('Сначала введите 4 показателя (Brix, кислотность, pH, вязкость)');
      return false;
    }

    generateBlank();
    return Boolean(currentData);
  }

  /**
   * Generate Blank from Form Data
   */
  function generateBlank(event) {
    if (event) event.preventDefault();

    const brix = parseFloat(brixInput.value);
    const acidity = parseFloat(acidityInput.value);
    const ph = parseFloat(phInput.value);
    const viscosity = parseFloat(viscosityInput.value);
    const batch = (batchInput.value || '№ 1').trim();
    const technician = (technicianInput.value || '').trim();

    if (isNaN(brix) || isNaN(acidity) || isNaN(ph) || isNaN(viscosity)) {
      showToast('Пожалуйста, заполните все 4 показателя');
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const organoAppearance = (organoAppearanceInput.value || 'Соответствует').trim();
    const organoTaste = (organoTasteInput.value || 'Соответствует').trim();
    const organoColor = (organoColorInput.value || 'Соответствует').trim();
    const organoImpurities = (organoImpuritiesInput.value || 'Отсутствуют').trim();

    currentData = {
      brix: brix,
      acidity: acidity,
      ph: ph,
      viscosity: viscosity,
      organoAppearance: organoAppearance,
      organoTaste: organoTaste,
      organoColor: organoColor,
      organoImpurities: organoImpurities,
      batch: batch,
      technician: technician,
      dateStr: dateStr,
      timestamp: now.getTime()
    };

    // Render Canvas & Image
    CanvasGenerator.render(blankCanvas, currentData);
    const dataUrl = blankCanvas.toDataURL('image/jpeg', 0.95);
    if (blankImage) {
      blankImage.src = dataUrl;
    }

    // Save to History
    HistoryManager.saveItem(currentData);

    // Show Preview Card
    previewTimestamp.textContent = dateStr;
    previewCard.classList.remove('hidden');

    // Smooth scroll to preview
    previewCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    showToast('Бланк успешно сформирован');
  }

  /**
   * Save JPG
   */
  async function handleSaveJpg() {
    if (!ensureData()) return;
    const safeBatch = (currentData.batch || '№_1').replace(/[^a-zA-Z0-9А-Яа-я-_№]/g, '_');
    const fileName = `Бланк_Пюре_${safeBatch}_${Date.now()}.jpg`;

    const result = await NativeBridge.saveJpgToGallery(blankCanvas, fileName);
    if (result.showModal && result.dataUrl && imageModal && modalPreviewImg) {
      modalPreviewImg.src = result.dataUrl;
      imageModal.classList.remove('hidden');
    }
    showToast(result.message, 4000);
  }

  /**
   * Save Word (.docx)
   */
  async function handleSaveDocx() {
    if (!ensureData()) return;
    try {
      const docxBytes = DocxGenerator.generateDocxBlob(currentData);
      const safeBatch = (currentData.batch || '№_1').replace(/[^a-zA-Z0-9А-Яа-я-_№]/g, '_');
      const fileName = `Бланк_Пюре_${safeBatch}_${Date.now()}.docx`;

      const result = await NativeBridge.saveDocx(docxBytes, fileName);
      showToast(result.message, 4000);
    } catch (err) {
      console.error('Docx generation error:', err);
      showToast('Ошибка при генерации Word документа');
    }
  }

  /**
   * Share
   */
  async function handleShare() {
    if (!ensureData()) return;
    const result = await NativeBridge.shareBlank(blankCanvas, currentData);
    if (result.showModal && result.dataUrl && imageModal && modalPreviewImg) {
      modalPreviewImg.src = result.dataUrl;
      imageModal.classList.remove('hidden');
    }
    showToast(result.message, 3500);
  }

  /**
   * Copy
   */
  async function handleCopy() {
    if (!ensureData()) return;
    const result = await NativeBridge.copyImageToClipboard(blankCanvas, currentData);
    if (result.showModal && result.dataUrl && imageModal && modalPreviewImg) {
      modalPreviewImg.src = result.dataUrl;
      imageModal.classList.remove('hidden');
    }
    showToast(result.message, 3500);
  }

  /**
   * Reset Form
   */
  function handleReset() {
    form.reset();
    organoAppearanceInput.value = '';
    organoTasteInput.value = '';
    organoColorInput.value = '';
    organoImpuritiesInput.value = '';
    brixInput.value = '';
    acidityInput.value = '';
    phInput.value = '';
    viscosityInput.value = '';
    batchInput.value = '№ 1';
    technicianInput.value = '';
    previewCard.classList.add('hidden');
    currentData = null;
    showToast('Форма очищена');
  }

  /**
   * Render History List in Modal
   */
  function renderHistory() {
    const items = HistoryManager.getItems();
    const query = (historySearch.value || '').toLowerCase().trim();

    const filtered = items.filter(item => {
      if (!query) return true;
      const b = (item.batch || '').toLowerCase();
      const d = (item.dateStr || '').toLowerCase();
      const t = (item.technician || '').toLowerCase();
      return b.includes(query) || d.includes(query) || t.includes(query);
    });

    if (filtered.length === 0) {
      historyList.innerHTML = `
        <div style="text-align: center; color: #64748b; padding: 30px 10px; font-weight: 600;">
          ${query ? 'Ничего не найдено по вашему запросу' : 'История сформированных бланков пуста'}
        </div>
      `;
      return;
    }

    historyList.innerHTML = filtered.map(item => `
      <div class="history-item">
        <div class="history-item-info">
          <div class="history-item-title">${item.batch ? 'Партия: ' + escapeHtml(item.batch) : 'Без номера партии'}</div>
          <div class="history-item-sub">${escapeHtml(item.dateStr)} • ${escapeHtml(item.technician || '—')}</div>
        </div>
        <div class="history-item-result">
          <div class="history-item-val">${item.brix.toFixed(1)}% | ${item.acidity.toFixed(2)}% | pH ${item.ph.toFixed(2)} | Вязк. ${(item.viscosity || 0).toFixed(1)} см</div>
          <div class="history-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window._loadHistoryItem('${item.id}')">Загрузить</button>
            <button type="button" class="btn btn-danger btn-sm" onclick="window._deleteHistoryItem('${item.id}')">Удалить</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  // Window helper functions for inline history buttons
  window._loadHistoryItem = function(id) {
    const items = HistoryManager.getItems();
    const found = items.find(item => item.id === id);
    if (!found) return;

    organoAppearanceInput.value = found.organoAppearance || '';
    organoTasteInput.value = found.organoTaste || '';
    organoColorInput.value = found.organoColor || '';
    organoImpuritiesInput.value = found.organoImpurities || '';

    brixInput.value = found.brix;
    acidityInput.value = found.acidity;
    phInput.value = found.ph;
    viscosityInput.value = found.viscosity || '';
    batchInput.value = found.batch || '№ 1';
    technicianInput.value = found.technician || '';

    currentData = {
      brix: found.brix,
      acidity: found.acidity,
      ph: found.ph,
      viscosity: found.viscosity || 0,
      organoAppearance: found.organoAppearance || 'Соответствует',
      organoTaste: found.organoTaste || 'Соответствует',
      organoColor: found.organoColor || 'Соответствует',
      organoImpurities: found.organoImpurities || 'Отсутствуют',
      batch: found.batch,
      technician: found.technician,
      dateStr: found.dateStr,
      timestamp: found.timestamp
    };

    CanvasGenerator.render(blankCanvas, currentData);
    const dataUrl = blankCanvas.toDataURL('image/jpeg', 0.95);
    if (blankImage) {
      blankImage.src = dataUrl;
    }
    previewTimestamp.textContent = found.dateStr;
    previewCard.classList.remove('hidden');

    historyModal.classList.add('hidden');
    previewCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('Данные бланка загружены из журнала');
  };

  window._deleteHistoryItem = function(id) {
    HistoryManager.deleteItem(id);
    renderHistory();
    showToast('Запись удалена');
  };

  // Event Listeners
  form.addEventListener('submit', generateBlank);
  btnReset.addEventListener('click', handleReset);
  btnSaveJpg.addEventListener('click', handleSaveJpg);
  btnSaveDocx.addEventListener('click', handleSaveDocx);
  btnShare.addEventListener('click', handleShare);
  btnCopy.addEventListener('click', handleCopy);

  // History Events
  btnOpenHistory.addEventListener('click', () => {
    historyModal.classList.remove('hidden');
    renderHistory();
  });

  btnCloseHistoryModal.addEventListener('click', () => {
    historyModal.classList.add('hidden');
  });

  historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
      historyModal.classList.add('hidden');
    }
  });

  historySearch.addEventListener('input', renderHistory);

  btnExportCsv.addEventListener('click', () => {
    const ok = HistoryManager.exportToCsv();
    if (ok) {
      showToast('Журнал экспортирован в CSV');
    } else {
      showToast('История пуста, нет данных для экспорта');
    }
  });

  btnClearHistory.addEventListener('click', () => {
    if (HistoryManager.getItems().length === 0) {
      showToast('История уже пуста');
      return;
    }
    HistoryManager.clearAll();
    renderHistory();
    showToast('Журнал полностью очищен');
  });

  // Image Modal Events
  if (btnCloseImageModal) {
    btnCloseImageModal.addEventListener('click', () => imageModal.classList.add('hidden'));
  }
  if (btnModalClose) {
    btnModalClose.addEventListener('click', () => imageModal.classList.add('hidden'));
  }
  if (btnModalDownload) {
    btnModalDownload.addEventListener('click', () => {
      handleSaveJpg();
      imageModal.classList.add('hidden');
    });
  }
  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.classList.add('hidden');
      }
    });
  }

  // Default values: all empty, batch = '№ 1'
  organoAppearanceInput.value = '';
  organoTasteInput.value = '';
  organoColorInput.value = '';
  organoImpuritiesInput.value = '';
  brixInput.value = '';
  acidityInput.value = '';
  phInput.value = '';
  viscosityInput.value = '';
  batchInput.value = '№ 1';
  technicianInput.value = '';
});
