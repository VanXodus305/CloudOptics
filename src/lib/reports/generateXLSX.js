// XLSX report generator for CloudOptics
// Uses exceljs + file-saver (client-side only)

const PURPLE_HEX   = "792CA2";
const LIGHT_PURPLE = "F3ECFF";
const NAV_DARK     = "111844";
const WHITE_HEX    = "FFFFFF";

function headerStyle(color = PURPLE_HEX) {
  return {
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: `FF${color}` } },
    font: { bold: true, color: { argb: `FF${WHITE_HEX}` }, size: 11 },
    alignment: { horizontal: "left", vertical: "middle", wrapText: false },
    border: {
      bottom: { style: "medium", color: { argb: "FF" + color } },
    },
  };
}

function subHeaderStyle() {
  return {
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3ECFF" } },
    font: { bold: true, color: { argb: "FF" + NAV_DARK }, size: 9 },
    alignment: { horizontal: "center", vertical: "middle" },
    border: {
      bottom: { style: "thin", color: { argb: "FFD8B4FE" } },
    },
  };
}

function cellStyle(bold = false, align = "left", color = NAV_DARK) {
  return {
    font: { bold, color: { argb: "FF" + color }, size: 9 },
    alignment: { horizontal: align, vertical: "middle" },
  };
}

function altRowFill(rowIndex) {
  return rowIndex % 2 === 0
    ? { fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } } }
    : {};
}

function applyAllCells(row, style) {
  row.eachCell({ includeEmpty: true }, (cell) => {
    Object.assign(cell, style);
    if (style.fill) cell.fill = style.fill;
    if (style.font) cell.font = style.font;
    if (style.alignment) cell.alignment = style.alignment;
    if (style.border) cell.border = style.border;
  });
}

function setStyle(cell, style) {
  if (style.fill)      cell.fill = style.fill;
  if (style.font)      cell.font = style.font;
  if (style.alignment) cell.alignment = style.alignment;
  if (style.border)    cell.border = style.border;
}

function autoFitColumns(sheet, minWidth = 10, maxWidth = 50) {
  sheet.columns.forEach((col) => {
    let max = minWidth;
    col.eachCell({ includeEmpty: false }, (cell) => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > max) max = len;
    });
    col.width = Math.min(max + 4, maxWidth);
  });
}

function addBrandedTitle(sheet, title, subtitle, colCount) {
  // Row 1 — big title cell
  sheet.mergeCells(1, 1, 1, colCount);
  const titleCell = sheet.getCell("A1");
  titleCell.value = `CloudOptics  ·  ${title}`;
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${PURPLE_HEX}` } };
  titleCell.font = { bold: true, size: 14, color: { argb: `FF${WHITE_HEX}` } };
  titleCell.alignment = { horizontal: "left", vertical: "middle" };
  sheet.getRow(1).height = 30;

  // Row 2 — subtitle / generated date
  sheet.mergeCells(2, 1, 2, colCount);
  const subCell = sheet.getCell("A2");
  subCell.value = subtitle;
  subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3ECFF" } };
  subCell.font = { italic: true, size: 9, color: { argb: "FF" + NAV_DARK } };
  subCell.alignment = { horizontal: "left", vertical: "middle" };
  sheet.getRow(2).height = 18;

  // Blank spacer row
  sheet.getRow(3).height = 6;

  return 4; // next data starts at row 4
}

export async function generateXLSX({
  summaryData,
  kpiTrends,
  donutData,
  donutFilter,
  resourcesData,
  formattedAlerts,
  currentChartData,
  chartTimeframe,
  trendsData,
}) {
  const ExcelJS = (await import("exceljs")).default;
  const { saveAs } = await import("file-saver");

  const wb = new ExcelJS.Workbook();
  wb.creator  = "CloudOptics";
  wb.lastModifiedBy = "CloudOptics";
  wb.created  = new Date();
  wb.modified = new Date();

  const now     = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const subtitle = `Environment: ${donutFilter || "All"}   ·   Generated: ${dateStr}   ·   CloudOptics Cloud Cost Intelligence`;

  // ─────────────────────────────────────────────────────────────────────────────
  // SHEET 1 — KPI SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────
  const s1 = wb.addWorksheet("Summary", { properties: { tabColor: { argb: `FF${PURPLE_HEX}` } } });
  s1.views = [{ state: "frozen", ySplit: 4 }];
  s1.columns = [
    { key: "metric", width: 22 },
    { key: "value",  width: 18 },
    { key: "change", width: 14 },
    { key: "period", width: 18 },
    { key: "notes",  width: 35 },
  ];

  let startRow = addBrandedTitle(s1, "KPI Summary", subtitle, 5);

  // Column headers row
  const hRow1 = s1.getRow(startRow++);
  ["Metric", "Value (USD)", "Change", "Period", "Notes"].forEach((h, i) => {
    const cell = hRow1.getCell(i + 1);
    cell.value = h;
    setStyle(cell, subHeaderStyle());
  });
  hRow1.height = 20;

  const kpiItems = [
    {
      metric: "Total Spend",
      value: summaryData?.totalSpend ?? 0,
      change: kpiTrends?.totalSpend?.trend ?? "—",
      period: kpiTrends?.totalSpend?.label ?? "vs last week",
      notes: "Projected monthly cloud budget across all services",
    },
    {
      metric: "Compute Spend",
      value: summaryData?.computeSpend ?? 0,
      change: kpiTrends?.computeSpend?.trend ?? "—",
      period: kpiTrends?.computeSpend?.label ?? "vs last week",
      notes: "EC2 and virtual machine compute fees",
    },
    {
      metric: "Storage Spend",
      value: summaryData?.storageSpend ?? 0,
      change: kpiTrends?.storageSpend?.trend ?? "—",
      period: kpiTrends?.storageSpend?.label ?? "vs last week",
      notes: "S3 buckets and snapshot storage costs",
    },
    {
      metric: "Total Savings",
      value: summaryData?.totalSavings ?? 0,
      change: kpiTrends?.totalSavings?.trend ?? "—",
      period: kpiTrends?.totalSavings?.label ?? "of spend",
      notes: "Actionable saving opportunities identified",
    },
  ];

  kpiItems.forEach((item, idx) => {
    const row = s1.getRow(startRow++);
    row.height = 22;

    const cells = [item.metric, item.value, item.change, item.period, item.notes];
    cells.forEach((val, i) => {
      const cell = row.getCell(i + 1);
      cell.value = val;
      if (idx % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };

      if (i === 0) { cell.font = { bold: true, color: { argb: "FF" + NAV_DARK }, size: 9 }; }
      else if (i === 1) {
        cell.numFmt = '"$"#,##0.00';
        cell.font = { bold: true, size: 10, color: { argb: "FF" + PURPLE_HEX } };
        cell.alignment = { horizontal: "right" };
      } else if (i === 2) {
        const isNeg = String(val).startsWith("-");
        const isPos = String(val).startsWith("+");
        cell.font = {
          bold: true,
          size: 9,
          color: { argb: isNeg ? "FFDC2626" : isPos ? "FF16A34A" : "FF6B7280" },
        };
        cell.alignment = { horizontal: "center" };
      } else {
        cell.font = { size: 9, color: { argb: "FF6B7280" } };
        cell.alignment = { horizontal: i === 3 ? "center" : "left" };
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // SHEET 2 — COST DISTRIBUTION
  // ─────────────────────────────────────────────────────────────────────────────
  const s2 = wb.addWorksheet("Cost Distribution", { properties: { tabColor: { argb: "FF9A4DCC" } } });
  s2.columns = [
    { key: "service", width: 28 },
    { key: "share",   width: 14 },
    { key: "cost",    width: 20 },
  ];

  startRow = addBrandedTitle(s2, "Cost Distribution", subtitle, 3);

  const hRow2 = s2.getRow(startRow++);
  ["Service", "Share (%)", "Estimated Cost (USD)"].forEach((h, i) => {
    const cell = hRow2.getCell(i + 1);
    cell.value = h;
    setStyle(cell, subHeaderStyle());
  });
  hRow2.height = 20;

  (donutData || []).forEach((item, idx) => {
    const row = s2.getRow(startRow++);
    row.height = 20;

    const c0 = row.getCell(1);
    c0.value = item.name;
    c0.font  = { bold: true, size: 9, color: { argb: "FF" + NAV_DARK } };
    if (idx % 2 === 0) c0.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };

    const c1 = row.getCell(2);
    c1.value = `${item.value}%`;
    c1.alignment = { horizontal: "center" };
    c1.font = { size: 9, color: { argb: "FF" + PURPLE_HEX } };
    if (idx % 2 === 0) c1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };

    const c2 = row.getCell(3);
    c2.value = item.rawCost ?? 0;
    c2.numFmt = '"$"#,##0.00';
    c2.alignment = { horizontal: "right" };
    c2.font = { size: 9, bold: true };
    if (idx % 2 === 0) c2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // SHEET 3 — COST TRENDS
  // ─────────────────────────────────────────────────────────────────────────────
  const s3 = wb.addWorksheet("Cost Trends", { properties: { tabColor: { argb: "FF6D28D9" } } });
  s3.columns = [
    { key: "period", width: 22 },
    { key: "cost",   width: 20 },
  ];

  startRow = addBrandedTitle(s3, `Cost Trends (${chartTimeframe})`, subtitle, 2);

  const hRow3 = s3.getRow(startRow++);
  ["Period", "Total Cost (USD)"].forEach((h, i) => {
    const cell = hRow3.getCell(i + 1);
    cell.value = h;
    setStyle(cell, subHeaderStyle());
  });
  hRow3.height = 20;

  // Write current chart timeframe data
  (currentChartData || []).forEach((item, idx) => {
    const row = s3.getRow(startRow++);
    row.height = 20;
    const c0 = row.getCell(1);
    c0.value = item.label;
    c0.font = { size: 9, bold: true, color: { argb: "FF" + NAV_DARK } };
    if (idx % 2 === 0) c0.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };

    const c1 = row.getCell(2);
    c1.value = item.value;
    c1.numFmt = '"$"#,##0.00';
    c1.alignment = { horizontal: "right" };
    c1.font = { size: 9, bold: true, color: { argb: "FF" + PURPLE_HEX } };
    if (idx % 2 === 0) c1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };
  });

  // Blank spacer then full daily trends if available
  if (trendsData && trendsData.length > 0) {
    startRow += 2;
    s3.mergeCells(startRow, 1, startRow, 2);
    const labelCell = s3.getCell(startRow, 1);
    labelCell.value = "Full Daily Trend Data (Last 30 Days)";
    labelCell.font = { bold: true, size: 10, color: { argb: "FF" + PURPLE_HEX } };
    labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3ECFF" } };
    s3.getRow(startRow).height = 18;
    startRow++;

    const dhRow = s3.getRow(startRow++);
    ["Date", "Daily Spend (USD)"].forEach((h, i) => {
      const cell = dhRow.getCell(i + 1);
      cell.value = h;
      setStyle(cell, subHeaderStyle());
    });

    trendsData.forEach((t, idx) => {
      const row = s3.getRow(startRow++);
      const c0 = row.getCell(1);
      c0.value = new Date(t.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
      c0.font = { size: 8, color: { argb: "FF" + NAV_DARK } };
      if (idx % 2 === 0) c0.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };

      const c1 = row.getCell(2);
      c1.value = Math.round(t.spend * 100) / 100;
      c1.numFmt = '"$"#,##0.00';
      c1.alignment = { horizontal: "right" };
      c1.font = { size: 8 };
      if (idx % 2 === 0) c1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SHEET 4 — RESOURCES
  // ─────────────────────────────────────────────────────────────────────────────
  const s4 = wb.addWorksheet("Resources", { properties: { tabColor: { argb: "FF5B21B6" } } });
  s4.views = [{ state: "frozen", ySplit: 4 }];
  s4.columns = [
    { key: "id",          width: 30 },
    { key: "region",      width: 14 },
    { key: "service",     width: 16 },
    { key: "env",         width: 14 },
    { key: "status",      width: 12 },
    { key: "cost",        width: 16 },
  ];

  startRow = addBrandedTitle(s4, "Cloud Resources", subtitle, 6);

  const hRow4 = s4.getRow(startRow++);
  ["Resource ID", "Region", "Service", "Environment", "Status", "Monthly Cost"].forEach((h, i) => {
    const cell = hRow4.getCell(i + 1);
    cell.value = h;
    setStyle(cell, subHeaderStyle());
  });
  hRow4.height = 20;

  (resourcesData || []).forEach((r, idx) => {
    const row = s4.getRow(startRow++);
    row.height = 18;

    const values = [r.name || r.resourceId, r.region, r.service, r.environment, r.status, r.cost ?? 0];
    values.forEach((val, i) => {
      const cell = row.getCell(i + 1);
      if (i === 5) {
        cell.value = val;
        cell.numFmt = '"$"#,##0.00';
        cell.alignment = { horizontal: "right" };
        cell.font = { bold: true, size: 9 };
      } else {
        cell.value = val;
        cell.font = { size: 9, bold: i === 0 };
      }
      if (idx % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };

      // Status colour
      if (i === 4) {
        if (val === "Running") cell.font = { size: 9, bold: true, color: { argb: "FF16A34A" } };
        else if (val === "Stopped") cell.font = { size: 9, color: { argb: "FF9CA3AF" } };
        else cell.font = { size: 9, bold: true, color: { argb: "FFDC2626" } };
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // SHEET 5 — ALERTS
  // ─────────────────────────────────────────────────────────────────────────────
  const s5 = wb.addWorksheet("Alerts", { properties: { tabColor: { argb: "FFDC2626" } } });
  s5.views = [{ state: "frozen", ySplit: 4 }];
  s5.columns = [
    { key: "title",    width: 28 },
    { key: "severity", width: 14 },
    { key: "category", width: 16 },
    { key: "status",   width: 14 },
    { key: "desc",     width: 55 },
  ];

  startRow = addBrandedTitle(s5, "Optimization Alerts", subtitle, 5);

  const hRow5 = s5.getRow(startRow++);
  ["Alert Title", "Severity", "Category", "Status", "Details"].forEach((h, i) => {
    const cell = hRow5.getCell(i + 1);
    cell.value = h;
    setStyle(cell, subHeaderStyle());
  });
  hRow5.height = 20;

  const severityFills = {
    Critical: "FFFEE2E2",
    High:     "FFFFF7ED",
    Medium:   "FFFEFCE8",
    Low:      "FFF0FDF4",
  };
  const severityColors = {
    Critical: "FFDC2626",
    High:     "FFEA580C",
    Medium:   "FFCA8A04",
    Low:      "FF16A34A",
  };

  (formattedAlerts || []).forEach((a, idx) => {
    const row = s5.getRow(startRow++);
    row.height = 20;

    const values = [a.title, a.severity, a.category, a.status, a.desc];
    values.forEach((val, i) => {
      const cell = row.getCell(i + 1);
      cell.value = val;
      cell.font = { size: 9, bold: i === 0 };
      cell.alignment = { vertical: "middle", wrapText: i === 4 };
      if (idx % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F5FF" } };

      if (i === 1 && severityColors[val]) {
        cell.font = { bold: true, size: 9, color: { argb: severityColors[val] } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: severityFills[val] || "FFFFF7ED" } };
        cell.alignment = { horizontal: "center" };
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WRITE FILE
  // ─────────────────────────────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = `CloudOptics_Report_${now.toISOString().slice(0, 10)}.xlsx`;
  saveAs(blob, filename);
}
