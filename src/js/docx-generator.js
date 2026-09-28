/**
 * Автономный генератор документов Microsoft Word (.docx) в чистом JavaScript
 * Создает валидный архив OpenXML с таблицами, стилями и разметкой
 */

class DocxGenerator {
  /**
   * Генерирует документ Word (.docx) в виде Blob
   * @param {Object} data - Данные анализа
   * @returns {Blob}
   */
  static generateDocxBlob(data) {
    const brix = isNaN(parseFloat(data.brix)) ? '0.0' : parseFloat(data.brix).toFixed(1);
    const acidity = isNaN(parseFloat(data.acidity)) ? '0.00' : parseFloat(data.acidity).toFixed(2);
    const ph = isNaN(parseFloat(data.ph)) ? '0.00' : parseFloat(data.ph).toFixed(2);
    const viscosity = isNaN(parseFloat(data.viscosity)) ? '0.0' : parseFloat(data.viscosity).toFixed(1);
    const organoAppearance = data.organoAppearance || 'Соответствует';
    const organoTaste = data.organoTaste || 'Соответствует';
    const organoColor = data.organoColor || 'Соответствует';
    const organoImpurities = data.organoImpurities || 'Отсутствуют';
    const batch = data.batch && data.batch.trim() ? data.batch.trim() : '№ 1';
    const timestamp = data.dateStr || data.timestamp || new Date().toLocaleString('ru-RU');
    const technician = data.technician && data.technician.trim() ? data.technician.trim() : '—';
    const dateStr = String(timestamp).split(' ')[0] || new Date().toLocaleDateString('ru-RU');

    // XML содержимое документа
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <!-- Заголовок -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="120" w:after="40"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
          <w:b/>
          <w:sz w:val="36"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>ПРОТОКОЛ ЛАБОРАТОРНОГО АНАЛИЗА</w:t>
      </w:r>
    </w:p>
    
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="0" w:after="240"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
          <w:b/>
          <w:sz w:val="24"/>
          <w:color w:val="0284C7"/>
        </w:rPr>
        <w:t>ГОСТ 32742-2014 «Полуфабрикаты. Пюре фруктовые. ТУ»</w:t>
      </w:r>
    </w:p>

    <!-- Метаданные -->
    <w:p>
      <w:pPr><w:spacing w:before="60" w:after="40"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Продукция: </w:t></w:r>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0284C7"/></w:rPr><w:t>Пюре яблочное натуральное</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:spacing w:before="40" w:after="40"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Номер / шифр партии: </w:t></w:r>
      <w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>${this.escapeXml(batch)}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:spacing w:before="40" w:after="200"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Дата и время анализа: </w:t></w:r>
      <w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>${this.escapeXml(timestamp)}</w:t></w:r>
    </w:p>

    <!-- Раздел 1. Органолептические показатели качества -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="180" w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
          <w:b/>
          <w:sz w:val="24"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>1. Органолептические показатели качества</w:t>
      </w:r>
    </w:p>

    <!-- Таблица 1: Органолептика -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9200" w:type="dxa"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="12" w:space="0" w:color="334155"/>
          <w:left w:val="single" w:sz="12" w:space="0" w:color="334155"/>
          <w:bottom w:val="single" w:sz="12" w:space="0" w:color="334155"/>
          <w:right w:val="single" w:sz="12" w:space="0" w:color="334155"/>
          <w:insideH w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:insideV w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        </w:tblBorders>
      </w:tblPr>
      
      <!-- Шапка таблицы 1 -->
      <w:tr>
        <w:trPr><w:tblHeader/></w:trPr>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="500" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
            <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar>
          </w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>№</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="2700" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
            <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar>
          </w:tcPr>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>Показатель</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="4200" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
            <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar>
          </w:tcPr>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>Требования по ГОСТ 32742-2014</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="1800" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
            <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar>
          </w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>Оценка</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Строка 1: Внешний вид -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>1</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2700" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Внешний вид и консистенция</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4200" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="334155"/></w:rPr><w:t>Однородная тонкоизмельченная протертая масса без частиц косточек, семян, семенных камер и кожицы</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="1800" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>${this.escapeXml(organoAppearance)}</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Строка 2: Вкус и запах -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>2</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2700" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Вкус и запах</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4200" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="334155"/></w:rPr><w:t>Натуральный, свойственный зрелым яблокам, прошедшим тепловую обработку, кисло-сладкий. Без посторонних привкусов</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="1800" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>${this.escapeXml(organoTaste)}</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Строка 3: Цвет -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>3</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2700" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Цвет</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4200" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="334155"/></w:rPr><w:t>Равномерный по всей массе, свойственный цвету мякоти свежих яблок (от светло-кремового до светло-желтого)</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="1800" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>${this.escapeXml(organoColor)}</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Строка 4: Примеси -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>4</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2700" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Посторонние примеси</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4200" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="334155"/></w:rPr><w:t>Не допускаются</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="1800" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>${this.escapeXml(organoImpurities)}</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <!-- Раздел 2. Физико-химические показатели качества -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="240" w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
          <w:b/>
          <w:sz w:val="24"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>2. Физико-химические показатели качества</w:t>
      </w:r>
    </w:p>

    <!-- Таблица 2: Физико-химия -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9200" w:type="dxa"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="12" w:space="0" w:color="334155"/>
          <w:left w:val="single" w:sz="12" w:space="0" w:color="334155"/>
          <w:bottom w:val="single" w:sz="12" w:space="0" w:color="334155"/>
          <w:right w:val="single" w:sz="12" w:space="0" w:color="334155"/>
          <w:insideH w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:insideV w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        </w:tblBorders>
      </w:tblPr>
      
      <!-- Шапка таблицы 2 -->
      <w:tr>
        <w:trPr><w:tblHeader/></w:trPr>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="500" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
            <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar>
          </w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>№</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="4200" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
            <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar>
          </w:tcPr>
          <w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>Наименование показателя</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="2500" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
            <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar>
          </w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>Норма по ГОСТ</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="2000" w:type="dxa"/>
            <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
            <w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar>
          </w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0F172A"/></w:rPr><w:t>Фактически</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Строка 1: Brix -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>1</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4200" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Массовая доля сухих веществ (Brix)</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="64748B"/></w:rPr><w:t>не менее 10 %</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0284C7"/></w:rPr><w:t>${brix} %</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Строка 2: Кислотность -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>2</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4200" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Массовая доля титруемых кислот (по яблочной кислоте)</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="64748B"/></w:rPr><w:t>0.20 – 0.80 %</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0284C7"/></w:rPr><w:t>${acidity} %</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Строка 3: pH -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>3</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4200" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Активная кислотность (pH)</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="64748B"/></w:rPr><w:t>3.40 – 4.20</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0284C7"/></w:rPr><w:t>${ph}</w:t></w:r></w:p>
        </w:tc>
      </w:tr>

      <!-- Строка 4: Вязкость по Боствику -->
      <w:tr>
        <w:tc>
          <w:tcPr><w:tcW w:w="500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="120"/><w:right w:w="120"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>4</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="4200" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Вязкость по Боствику (20 °C, 30 с)</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2500" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="64748B"/></w:rPr><w:t>3.0 – 9.0 см</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:tcMar><w:top w:w="100"/><w:bottom w:w="100"/><w:left w:w="140"/><w:right w:w="140"/></w:tcMar></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="0284C7"/></w:rPr><w:t>${viscosity} см</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <!-- Подвал и исполнитель -->
    <w:p>
      <w:pPr><w:spacing w:before="480" w:after="80"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Испытания провел(а) (Ф.И.О.): </w:t></w:r>
      <w:r><w:rPr><w:sz w:val="24"/><w:color w:val="0284C7"/></w:rPr><w:t>${this.escapeXml(technician)}</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:spacing w:before="80" w:after="100"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>Дата выдачи протокола: </w:t></w:r>
      <w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>${this.escapeXml(dateStr)}</w:t></w:r>
    </w:p>
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;

    // Создаем ZIP архив в памяти
    const zip = new MiniZip();
    zip.addFile('[Content_Types].xml', contentTypesXml);
    zip.addFile('_rels/.rels', relsXml);
    zip.addFile('word/_rels/document.xml.rels', docRelsXml);
    zip.addFile('word/document.xml', documentXml);

    const zipBytes = zip.generate();
    return zipBytes;
  }

  static download(docxBytes, fileName = 'blank_puree.docx') {
    const blob = new Blob([docxBytes], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  static generate(data) {
    return this.generateDocxBlob(data);
  }

  static escapeXml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

/**
 * Легковесный генератор ZIP файлов в чистом JS без внешних библиотек
 */
class MiniZip {
  constructor() {
    this.files = [];
  }

  addFile(name, content) {
    const utf8Encoder = new TextEncoder();
    const data = typeof content === 'string' ? utf8Encoder.encode(content) : new Uint8Array(content);
    this.files.push({ name, data });
  }

  generate() {
    const localHeaders = [];
    const centralHeaders = [];
    let offset = 0;

    for (const file of this.files) {
      const nameBytes = new TextEncoder().encode(file.name);
      const crc = this.crc32(file.data);
      const size = file.data.length;

      // Local File Header (30 байт + имя)
      const localHeader = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(localHeader.buffer);
      lv.setUint32(0, 0x04034b50, true); // Сигнатура
      lv.setUint16(4, 20, true);         // Версия
      lv.setUint16(6, 0x0800, true);     // Флаг (UTF-8)
      lv.setUint16(8, 0, true);          // Метод сжатия (Store)
      lv.setUint16(10, 0, true);         // Время
      lv.setUint16(12, 0, true);         // Дата
      lv.setUint32(14, crc, true);       // CRC-32
      lv.setUint32(18, size, true);      // Сжатый размер
      lv.setUint32(22, size, true);      // Несжатый размер
      lv.setUint16(26, nameBytes.length, true); // Длина имени
      lv.setUint16(28, 0, true);         // Extra field length
      localHeader.set(nameBytes, 30);

      // Central Directory Header (46 байт + имя)
      const centralHeader = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(centralHeader.buffer);
      cv.setUint32(0, 0x02014b50, true); // Сигнатура
      cv.setUint16(4, 20, true);         // Версия создателя
      cv.setUint16(6, 20, true);         // Мин. версия
      cv.setUint16(8, 0x0800, true);     // Флаг (UTF-8)
      cv.setUint16(10, 0, true);         // Метод сжатия
      cv.setUint16(12, 0, true);         // Время
      cv.setUint16(14, 0, true);         // Дата
      cv.setUint32(16, crc, true);       // CRC-32
      cv.setUint32(20, size, true);      // Сжатый размер
      cv.setUint32(24, size, true);      // Несжатый размер
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);    // Смещение Local Header
      centralHeader.set(nameBytes, 46);

      localHeaders.push(localHeader, file.data);
      centralHeaders.push(centralHeader);

      offset += localHeader.length + file.data.length;
    }

    const centralDirOffset = offset;
    let centralDirSize = 0;
    for (const ch of centralHeaders) {
      centralDirSize += ch.length;
    }

    // End of Central Directory (22 байта)
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, this.files.length, true);
    ev.setUint16(10, this.files.length, true);
    ev.setUint32(12, centralDirSize, true);
    ev.setUint32(16, centralDirOffset, true);
    ev.setUint16(20, 0, true);

    // Сборка всех частей в один буфер
    const totalSize = offset + centralDirSize + 22;
    const result = new Uint8Array(totalSize);
    let cur = 0;

    for (const lh of localHeaders) {
      result.set(lh, cur);
      cur += lh.length;
    }
    for (const ch of centralHeaders) {
      result.set(ch, cur);
      cur += ch.length;
    }
    result.set(eocd, cur);

    return result;
  }

  crc32(data) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ this.table[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }
}

// Таблица CRC32
MiniZip.prototype.table = (() => {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }
  return table;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DocxGenerator;
}
