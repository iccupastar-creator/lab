/**
 * History Manager for Apple Puree Lab Quality Blanks
 * Stores local history in localStorage, supports search, filtering, and CSV export.
 */

class HistoryManager {
  static STORAGE_KEY = 'lab_puree_blanks_history';

  /**
   * Get all history items
   * @returns {Array<Object>}
   */
  static getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read history:', e);
      return [];
    }
  }

  /**
   * Save item to history
   * @param {Object} item 
   */
  static saveItem(item) {
    try {
      const items = this.getItems();
      const newItem = {
        id: item.id || Date.now().toString(),
        timestamp: item.timestamp || Date.now(),
        dateStr: item.dateStr || new Date().toLocaleString('ru-RU'),
        brix: parseFloat(item.brix) || 0,
        acidity: parseFloat(item.acidity) || 0,
        ph: parseFloat(item.ph) || 0,
        viscosity: parseFloat(item.viscosity) || 0,
        organoAppearance: item.organoAppearance || 'Соответствует',
        organoTaste: item.organoTaste || 'Соответствует',
        organoColor: item.organoColor || 'Соответствует',
        organoImpurities: item.organoImpurities || 'Отсутствуют',
        batch: (item.batch || '№ 1').trim(),
        technician: (item.technician || '').trim()
      };

      // Unshift to top, limit to 100 entries
      items.unshift(newItem);
      if (items.length > 100) {
        items.length = 100;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      return newItem;
    } catch (e) {
      console.error('Failed to save history item:', e);
      return null;
    }
  }

  /**
   * Delete item by ID
   * @param {string} id 
   */
  static deleteItem(id) {
    try {
      const items = this.getItems().filter(item => item.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to delete history item:', e);
    }
  }

  /**
   * Clear all history
   */
  static clearAll() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  }

  /**
   * Export history to CSV file with UTF-8 BOM
   */
  static exportToCsv() {
    const items = this.getItems();
    if (items.length === 0) {
      return false;
    }

    // Header row
    const headers = [
      'Дата и время',
      'Партия',
      'Сухие вещества (Brix), %',
      'Кислотность (по яблочной к-те), %',
      'pH',
      'Вязкость по Боствику, см',
      'Исполнитель'
    ];

    const rows = items.map(item => [
      `"${item.dateStr || ''}"`,
      `"${(item.batch || '№ 1').replace(/"/g, '""')}"`,
      `"${item.brix.toFixed(1)}"`,
      `"${item.acidity.toFixed(2)}"`,
      `"${item.ph.toFixed(2)}"`,
      `"${(item.viscosity || 0).toFixed(1)}"`,
      `"${(item.technician || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Журнал_анализов_пюре_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  }
}

window.HistoryManager = HistoryManager;
