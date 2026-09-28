/**
 * Bulletproof Native Bridge for Android App (AndroidNative) & Web Browsers
 * Handles gallery saving, file downloads, image clipboard copying, and sharing.
 */

class NativeBridge {
  static isAndroidNative() {
    return Boolean(typeof window !== 'undefined' && window.AndroidNative);
  }

  static isCapacitor() {
    return Boolean(
      typeof window !== 'undefined' &&
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform()
    );
  }

  /**
   * Convert Data URL to Blob (synchronous)
   */
  static dataUrlToBlob(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return new Blob([]);
    const arr = dataUrl.split(',');
    if (arr.length < 2) return new Blob([]);
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Convert Data URL to File (synchronous)
   */
  static dataUrlToFile(dataUrl, fileName) {
    if (!dataUrl || typeof dataUrl !== 'string') return new File([], fileName, { type: 'image/jpeg' });
    const arr = dataUrl.split(',');
    if (arr.length < 2) return new File([], fileName, { type: 'image/jpeg' });
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  /**
   * Trigger direct download of a Blob
   */
  static downloadBlob(blob, fileName) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try { document.body.removeChild(a); } catch (e) {}
        try { URL.revokeObjectURL(url); } catch (e) {}
      }, 4000);
      return true;
    } catch (e) {
      console.error('Blob download failed:', e);
      return false;
    }
  }

  /**
   * Save Image (JPG) to Device Gallery / Storage
   * @param {HTMLCanvasElement} canvas
   * @param {string} fileName
   * @returns {Promise<{success: boolean, message: string, dataUrl: string, showModal?: boolean}>}
   */
  static async saveJpgToGallery(canvas, fileName = 'blank_puree.jpg') {
    if (!canvas) {
      return { success: false, showModal: false, message: 'Ошибка: бланк не сформирован' };
    }
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const base64Data = dataUrl.split(',')[1];

    try {
      // 1. Standalone Native Android App (Direct Gallery Save)
      if (this.isAndroidNative() && typeof window.AndroidNative.saveJpgToGallery === 'function') {
        const resStr = window.AndroidNative.saveJpgToGallery(base64Data, fileName);
        try {
          const res = JSON.parse(resStr);
          return { success: res.success, dataUrl, showModal: false, message: res.message };
        } catch (e) {
          return { success: true, dataUrl, showModal: false, message: `Фото сохранено в Галерею (${fileName})` };
        }
      }

      // 2. Capacitor Android APK
      if (this.isCapacitor()) {
        try {
          const plugins = (window.Capacitor && window.Capacitor.Plugins) || {};
          const Filesystem = plugins.Filesystem;
          if (Filesystem && typeof Filesystem.writeFile === 'function') {
            try {
              if (typeof Filesystem.requestPermissions === 'function') {
                await Filesystem.requestPermissions();
              }
            } catch (pErr) {}

            try {
              await Filesystem.writeFile({
                path: `Pictures/${fileName}`,
                data: base64Data,
                directory: 'EXTERNAL_STORAGE',
                recursive: true
              });
              return { success: true, dataUrl, showModal: false, message: `Фото сохранено в Галерею (${fileName})` };
            } catch (e1) {
              await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: 'DOCUMENTS',
                recursive: true
              });
              return { success: true, dataUrl, showModal: false, message: `Файл сохранен в Документы (${fileName})` };
            }
          }
        } catch (capErr) {
          console.warn('Capacitor save failed:', capErr);
        }
      }

      // 3. Web Browser - Direct download
      const blob = this.dataUrlToBlob(dataUrl);
      const downloaded = this.downloadBlob(blob, fileName);
      return {
        success: true,
        dataUrl,
        showModal: false,
        message: downloaded ? 'Фото бланка (JPG) успешно скачано' : 'Не удалось скачать файл'
      };
    } catch (err) {
      console.error('Error saving JPG:', err);
      return {
        success: false,
        dataUrl,
        showModal: true,
        message: `Ошибка сохранения: ${err.message || err}`
      };
    }
  }

  /**
   * Save DOCX File to Device
   * @param {Blob|Uint8Array} docxBytes
   * @param {string} fileName
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async saveDocx(docxBytes, fileName = 'blank_puree.docx') {
    try {
      if (!docxBytes) {
        throw new Error('Данные документа не сформированы');
      }

      let base64Data = '';
      if (docxBytes instanceof Blob) {
        const buf = await docxBytes.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        base64Data = btoa(binary);
      } else {
        let binary = '';
        const len = docxBytes.byteLength || docxBytes.length;
        for (let i = 0; i < len; i++) binary += String.fromCharCode(docxBytes[i]);
        base64Data = btoa(binary);
      }

      // 1. Standalone Native Android App
      if (this.isAndroidNative() && typeof window.AndroidNative.saveDocx === 'function') {
        const resStr = window.AndroidNative.saveDocx(base64Data, fileName);
        try {
          const res = JSON.parse(resStr);
          return { success: res.success, message: res.message };
        } catch (e) {
          return { success: true, message: `Документ Word сохранен: ${fileName}` };
        }
      }

      // 2. Capacitor Native Android APK
      if (this.isCapacitor()) {
        try {
          const plugins = (window.Capacitor && window.Capacitor.Plugins) || {};
          const Filesystem = plugins.Filesystem;
          if (Filesystem && typeof Filesystem.writeFile === 'function') {
            await Filesystem.writeFile({
              path: `Documents/${fileName}`,
              data: base64Data,
              directory: 'EXTERNAL_STORAGE',
              recursive: true
            });
            return { success: true, message: `Документ Word сохранен: ${fileName}` };
          }
        } catch (capErr) {
          console.warn('Capacitor DOCX save failed:', capErr);
        }
      }

      // 3. Web Browser - Direct download
      let blob;
      if (docxBytes instanceof Blob) {
        blob = docxBytes;
      } else {
        blob = new Blob([docxBytes], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      }
      this.downloadBlob(blob, fileName);
      return { success: true, message: 'Документ Word (.docx) успешно скачан' };
    } catch (err) {
      console.error('Error saving DOCX:', err);
      return { success: false, message: `Ошибка Word: ${err.message || err}` };
    }
  }

  /**
   * Share blank via system sheet (Telegram, WhatsApp, etc.)
   * @param {HTMLCanvasElement} canvas
   * @param {Object} data
   * @returns {Promise<{success: boolean, message: string, showModal?: boolean, dataUrl?: string}>}
   */
  static async shareBlank(canvas, data) {
    if (!canvas) {
      return { success: false, showModal: false, message: 'Ошибка: бланк не сформирован' };
    }
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const base64Data = dataUrl.split(',')[1];
    const safeBatch = (data && data.batch ? data.batch : '№_1').replace(/[^a-zA-Z0-9А-Яа-я-_№]/g, '_');
    const fileName = `Бланк_Пюре_${safeBatch}.jpg`;

    try {
      // 1. Standalone Native Android App
      if (this.isAndroidNative() && typeof window.AndroidNative.shareImage === 'function') {
        const resStr = window.AndroidNative.shareImage(base64Data, fileName);
        try {
          const res = JSON.parse(resStr);
          return { success: res.success, showModal: false, message: res.message };
        } catch (e) {
          return { success: true, showModal: false, message: 'Диалог отправки открыт' };
        }
      }

      // 2. Capacitor Native Android APK
      if (this.isCapacitor()) {
        try {
          const plugins = (window.Capacitor && window.Capacitor.Plugins) || {};
          const Share = plugins.Share;
          const Filesystem = plugins.Filesystem;
          if (Share && typeof Share.share === 'function') {
            let fileUri;
            if (Filesystem && typeof Filesystem.writeFile === 'function') {
              try {
                const tempName = `blank_${Date.now()}.jpg`;
                const saved = await Filesystem.writeFile({
                  path: tempName,
                  data: base64Data,
                  directory: 'CACHE'
                });
                fileUri = saved.uri;
              } catch (e) {
                console.warn('Cache write for share failed:', e);
              }
            }
            await Share.share({
              title: 'Бланк качества пюре',
              text: `Бланк анализа качества яблочного пюре (${data && data.batch ? data.batch : '№ 1'})`,
              files: fileUri ? [fileUri] : undefined,
              dialogTitle: 'Поделиться бланком'
            });
            return { success: true, showModal: false, message: 'Диалог отправки открыт' };
          }
        } catch (capErr) {
          if (capErr && capErr.message && capErr.message.toLowerCase().includes('cancel')) {
            return { success: true, showModal: false, message: 'Отправка отменена' };
          }
          console.warn('Capacitor share failed:', capErr);
        }
      }

      // 3. Web Share API с JPG файлом
      const file = this.dataUrlToFile(dataUrl, fileName);
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Бланк качества пюре',
            text: `Бланк анализа качества яблочного пюре (${data && data.batch ? data.batch : '№ 1'})`,
            files: [file]
          });
          return { success: true, showModal: false, message: 'Фото бланка успешно отправлено' };
        } catch (shareErr) {
          if (shareErr && shareErr.name === 'AbortError') {
            return { success: true, showModal: false, message: 'Отправка отменена' };
          }
          console.warn('navigator.share with file failed:', shareErr);
        }
      }

      // 4. Fallback: navigator.share без файла
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Бланк качества пюре',
            text: `Бланк анализа качества яблочного пюре (${data && data.batch ? data.batch : '№ 1'})`
          });
          return { success: true, showModal: false, message: 'Диалог отправки открыт' };
        } catch (e) {
          if (e && e.name === 'AbortError') {
            return { success: true, showModal: false, message: 'Отправка отменена' };
          }
        }
      }

      // 5. Fallback: Modal for long press
      return {
        success: true,
        showModal: true,
        dataUrl,
        message: 'Удерживайте фото в окне для отправки через Telegram / WhatsApp'
      };
    } catch (err) {
      if (err && err.name === 'AbortError') {
        return { success: true, showModal: false, message: 'Отправка отменена' };
      }
      console.error('Error sharing:', err);
      return {
        success: true,
        showModal: true,
        dataUrl,
        message: 'Удерживайте фото в окне для отправки'
      };
    }
  }

  /**
   * Copy image to clipboard
   * @param {HTMLCanvasElement} canvas
   * @param {Object} data
   * @returns {Promise<{success: boolean, message: string, showModal?: boolean, dataUrl?: string}>}
   */
  static async copyImageToClipboard(canvas, data) {
    if (!canvas) {
      return { success: false, showModal: false, message: 'Ошибка: бланк не сформирован' };
    }
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];
    const blob = this.dataUrlToBlob(dataUrl);

    // 1. Standalone Native Android App
    if (this.isAndroidNative() && typeof window.AndroidNative.copyImageToClipboard === 'function') {
      const resStr = window.AndroidNative.copyImageToClipboard(base64Data);
      try {
        const res = JSON.parse(resStr);
        return { success: res.success, showModal: false, message: res.message };
      } catch (e) {
        return { success: true, showModal: false, message: 'Фото бланка скопировано в буфер' };
      }
    }

    // 2. Capacitor Native Android APK
    if (this.isCapacitor()) {
      try {
        const plugins = (window.Capacitor && window.Capacitor.Plugins) || {};
        const Clipboard = plugins.Clipboard;
        if (Clipboard) {
          if (typeof Clipboard.setImage === 'function') {
            await Clipboard.setImage({ image: base64Data });
            return { success: true, showModal: false, message: 'Фото бланка скопировано в буфер обмена' };
          } else if (typeof Clipboard.write === 'function') {
            await Clipboard.write({ image: base64Data });
            return { success: true, showModal: false, message: 'Фото бланка скопировано в буфер обмена' };
          }
        }
      } catch (capErr) {
        console.warn('Capacitor clipboard failed:', capErr);
      }
    }

    // 3. Web Browser - ClipboardItem
    if (
      typeof ClipboardItem !== 'undefined' &&
      navigator.clipboard &&
      navigator.clipboard.write &&
      window.isSecureContext
    ) {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        return { success: true, showModal: false, message: 'Фото бланка скопировано в буфер обмена' };
      } catch (err) {
        console.warn('ClipboardItem write blocked by browser:', err);
      }
    }

    // 4. Fallback: Modal for long press
    return {
      success: true,
      showModal: true,
      dataUrl,
      message: 'Удерживайте фото в окне для копирования или сохранения'
    };
  }
}

window.NativeBridge = NativeBridge;
