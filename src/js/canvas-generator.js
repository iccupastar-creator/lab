/**
 * Canvas Generator for Apple Puree Lab Quality Report
 * High-Resolution 2x Canvas rendering for crystal clear image export (JPG/PNG)
 * Standard: GOСТ 32742-2014
 */

class CanvasGenerator {
  /**
   * Render blank to canvas
   * @param {HTMLCanvasElement} canvas 
   * @param {Object} data 
   */
  static render(canvas, data) {
    const ctx = canvas.getContext('2d');
    
    // Canvas dimensions (2x for ultra sharp resolution on mobile/retina)
    const width = 1200;
    const height = 1120;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Outer decorative border
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Inner thin border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Top Header Banner
    const gradient = ctx.createLinearGradient(40, 40, width - 40, 160);
    gradient.addColorStop(0, '#0369a1');
    gradient.addColorStop(1, '#0284c7');
    ctx.fillStyle = gradient;
    ctx.fillRect(40, 40, width - 80, 130);

    // Header Title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText('ПРОТОКОЛ ЛАБОРАТОРНОГО АНАЛИЗА', width / 2, 95);

    ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText('ГОСТ 32742-2014 «Полуфабрикаты. Пюре фруктовые. ТУ»', width / 2, 135);

    // Meta Information Grid (2 Columns)
    const metaY = 195;
    const metaHeight = 115;
    
    // Left Box: Product & Batch
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(70, metaY, 510, metaHeight);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(70, metaY, 510, metaHeight);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText('Продукция:', 90, metaY + 36);
    ctx.fillText('Партия / Идентификатор:', 90, metaY + 78);

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText('Пюре яблочное натуральное', 200, metaY + 36);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText(data.batch || '№ 1', 330, metaY + 78);

    // Right Box: Date & Technician
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(620, metaY, 510, metaHeight);
    ctx.strokeRect(620, metaY, 510, metaHeight);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText('Дата и время анализа:', 640, metaY + 36);
    ctx.fillText('Исполнитель (Ф.И.О.):', 640, metaY + 78);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText(data.dateStr || new Date().toLocaleString('ru-RU'), 855, metaY + 36);
    ctx.fillText(data.technician || '—', 855, metaY + 78);

    // Section 1: Органолептические показатели
    const sec1Y = 360;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText('1. Органолептические показатели качества', 70, sec1Y);

    // Table 1: Organoleptic
    const tableX = 70;
    const table1Y = sec1Y + 15;
    const tableWidth = width - 140; // 1060px
    const colWidths1 = [60, 270, 530, 200];
    const headerHeight = 44;
    const organoRowHeight = 50;

    // Table 1 Header Background
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(tableX, table1Y, tableWidth, headerHeight);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tableX, table1Y, tableWidth, headerHeight);

    // Vertical Header Dividers T1
    let currX1 = tableX;
    for (let i = 0; i < colWidths1.length - 1; i++) {
      currX1 += colWidths1[i];
      ctx.beginPath();
      ctx.moveTo(currX1, table1Y);
      ctx.lineTo(currX1, table1Y + headerHeight);
      ctx.stroke();
    }

    // Header 1 Texts
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('№', tableX + colWidths1[0] / 2, table1Y + 28);
    ctx.textAlign = 'left';
    ctx.fillText('Наименование показателя', tableX + colWidths1[0] + 15, table1Y + 28);
    ctx.fillText('Требования по ГОСТ 32742-2014', tableX + colWidths1[0] + colWidths1[1] + 15, table1Y + 28);
    ctx.textAlign = 'center';
    ctx.fillText('Фактическая оценка', tableX + colWidths1[0] + colWidths1[1] + colWidths1[2] + colWidths1[3] / 2, table1Y + 28);

    const organoRows = [
      {
        num: '1',
        title: 'Внешний вид и консистенция',
        normLine1: 'Однородная тонкоизмельченная протертая масса без частиц',
        normLine2: 'косточек, семян, семенных камер и кожицы',
        val: data.organoAppearance || 'Соответствует'
      },
      {
        num: '2',
        title: 'Вкус и запах',
        normLine1: 'Натуральный, свойственный зрелым яблокам, прошедшим',
        normLine2: 'тепловую обработку, кисло-сладкий. Без посторонних привкусов',
        val: data.organoTaste || 'Соответствует'
      },
      {
        num: '3',
        title: 'Цвет',
        normLine1: 'Равномерный по всей массе, свойственный цвету мякоти',
        normLine2: 'свежих яблок (от светло-кремового до светло-желтого)',
        val: data.organoColor || 'Соответствует'
      },
      {
        num: '4',
        title: 'Посторонние примеси',
        normLine1: 'Не допускаются',
        normLine2: '',
        val: data.organoImpurities || 'Отсутствуют'
      }
    ];

    let curY1 = table1Y + headerHeight;

    organoRows.forEach((row, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      ctx.fillRect(tableX, curY1, tableWidth, organoRowHeight);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(tableX, curY1, tableWidth, organoRowHeight);

      // Dividers
      let rX = tableX;
      for (let i = 0; i < colWidths1.length - 1; i++) {
        rX += colWidths1[i];
        ctx.beginPath();
        ctx.moveTo(rX, curY1);
        ctx.lineTo(rX, curY1 + organoRowHeight);
        ctx.stroke();
      }

      // Col 1: Num
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(row.num, tableX + colWidths1[0] / 2, curY1 + 31);

      // Col 2: Title
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(row.title, tableX + colWidths1[0] + 15, curY1 + 31);

      // Col 3: Norm (2 lines if present)
      ctx.fillStyle = '#334155';
      ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      if (row.normLine2) {
        ctx.fillText(row.normLine1, tableX + colWidths1[0] + colWidths1[1] + 15, curY1 + 22);
        ctx.fillText(row.normLine2, tableX + colWidths1[0] + colWidths1[1] + 15, curY1 + 40);
      } else {
        ctx.fillText(row.normLine1, tableX + colWidths1[0] + colWidths1[1] + 15, curY1 + 31);
      }

      // Col 4: Fact Assessment (Bold black)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(row.val, tableX + colWidths1[0] + colWidths1[1] + colWidths1[2] + colWidths1[3] / 2, curY1 + 31);

      curY1 += organoRowHeight;
    });

    // Outer border Table 1
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(tableX, table1Y, tableWidth, headerHeight + organoRows.length * organoRowHeight);


    // Section 2: Физико-химические показатели
    const sec2Y = curY1 + 32;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText('2. Физико-химические показатели качества', 70, sec2Y);

    // Table 2: Physico-Chemical
    const table2Y = sec2Y + 15;
    const colWidths2 = [60, 480, 260, 260];
    const row2Height = 62;

    // Table 2 Header
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(tableX, table2Y, tableWidth, headerHeight);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tableX, table2Y, tableWidth, headerHeight);

    // Vertical Dividers T2 Header
    let currX2 = tableX;
    for (let i = 0; i < colWidths2.length - 1; i++) {
      currX2 += colWidths2[i];
      ctx.beginPath();
      ctx.moveTo(currX2, table2Y);
      ctx.lineTo(currX2, table2Y + headerHeight);
      ctx.stroke();
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('№', tableX + colWidths2[0] / 2, table2Y + 28);
    ctx.textAlign = 'left';
    ctx.fillText('Наименование показателя', tableX + colWidths2[0] + 15, table2Y + 28);
    ctx.textAlign = 'center';
    ctx.fillText('Норма по ГОСТ', tableX + colWidths2[0] + colWidths2[1] + colWidths2[2] / 2, table2Y + 28);
    ctx.fillText('Фактически', tableX + colWidths2[0] + colWidths2[1] + colWidths2[2] + colWidths2[3] / 2, table2Y + 28);

    const brixVal = isNaN(parseFloat(data.brix)) ? '0.0' : parseFloat(data.brix).toFixed(1);
    const acidityVal = isNaN(parseFloat(data.acidity)) ? '0.00' : parseFloat(data.acidity).toFixed(2);
    const phVal = isNaN(parseFloat(data.ph)) ? '0.00' : parseFloat(data.ph).toFixed(2);
    const viscVal = isNaN(parseFloat(data.viscosity)) ? '0.0' : parseFloat(data.viscosity).toFixed(1);

    const rows2 = [
      {
        num: '1',
        title: 'Массовая доля растворимых сухих веществ (Brix)',
        sub: '(рефрактометрический метод)',
        norm: 'не менее 10,0 %',
        val: `${brixVal} %`
      },
      {
        num: '2',
        title: 'Массовая доля титрируемых кислот',
        sub: '(в пересчете на яблочную кислоту)',
        norm: '0,20 – 0,80 %',
        val: `${acidityVal} %`
      },
      {
        num: '3',
        title: 'Активная кислотность',
        sub: '(водородный показатель pH)',
        norm: '3,40 – 4,20',
        val: `${phVal}`
      },
      {
        num: '4',
        title: 'Вязкость по Боствику',
        sub: '(консистентометр Боствика, 20 °C, 30 с)',
        norm: '3,0 – 9,0 см',
        val: `${viscVal} см`
      }
    ];

    let curY2 = table2Y + headerHeight;

    rows2.forEach((row, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      ctx.fillRect(tableX, curY2, tableWidth, row2Height);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(tableX, curY2, tableWidth, row2Height);

      // Dividers
      let rX = tableX;
      for (let i = 0; i < colWidths2.length - 1; i++) {
        rX += colWidths2[i];
        ctx.beginPath();
        ctx.moveTo(rX, curY2);
        ctx.lineTo(rX, curY2 + row2Height);
        ctx.stroke();
      }

      // Col 1: Num
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(row.num, tableX + colWidths2[0] / 2, curY2 + 38);

      // Col 2: Title & Sub
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(row.title, tableX + colWidths2[0] + 15, curY2 + 26);

      ctx.fillStyle = '#64748b';
      ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(row.sub, tableX + colWidths2[0] + 15, curY2 + 48);

      // Col 3: Norm
      ctx.textAlign = 'center';
      ctx.fillStyle = '#334155';
      ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(row.norm, tableX + colWidths2[0] + colWidths2[1] + colWidths2[2] / 2, curY2 + 38);

      // Col 4: Fact Value (Bold blue)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(row.val, tableX + colWidths2[0] + colWidths2[1] + colWidths2[2] + colWidths2[3] / 2, curY2 + 38);

      curY2 += row2Height;
    });

    // Outer border Table 2
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(tableX, table2Y, tableWidth, headerHeight + rows2.length * row2Height);

    // Technician / Reporter Section
    const signY = curY2 + 28;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText('Испытания провел(а) (Ф.И.О.):', 70, signY + 20);

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText(data.technician || '—', 390, signY + 20);
  }

  /**
   * Convert canvas to Blob (JPG)
   * @param {HTMLCanvasElement} canvas 
   * @param {number} quality (0.0 - 1.0)
   * @returns {Promise<Blob>}
   */
  static toBlob(canvas, quality = 0.95) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', quality);
    });
  }

  /**
   * Convert canvas to Data URL
   * @param {HTMLCanvasElement} canvas 
   * @param {number} quality 
   * @returns {string}
   */
  static toDataURL(canvas, quality = 0.95) {
    return canvas.toDataURL('image/jpeg', quality);
  }
}

window.CanvasGenerator = CanvasGenerator;
