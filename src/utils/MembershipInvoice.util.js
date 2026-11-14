import PDFDocument from "pdfkit";

// Membership invoices are generated as a PDF attachment when an admin confirms
// the member's offline payment. Everything here is deliberately dependency-light
// (pdfkit's built-in Helvetica fonts only) so it works the same on any host.

const BRAND = "#387cae";
const BRAND_DARK = "#2d658e";
const INK = "#0f172a";
const MUTED = "#64748b";
const SOFT = "#f8fafc";
const LINE = "#e2e8f0";
const GREEN = "#15803d";
const GREEN_BG = "#ecfdf5";
const AMBER = "#b45309";
const AMBER_BG = "#fffbeb";

const PAGE_MARGIN = 50;

// Mirrors the fallbacks used by the approval email so legacy rows that predate
// the dynamic membership options still render a readable label.
const LEVEL_LABELS = {
  PLUS2: "+2 / Grade 12",
  BACHELORS: "Bachelor's - Running",
  GRADUATE: "Graduate",
};

const FIELD_LABELS = {
  it: "Information Technology",
  hospitality: "Hospitality Management",
  business: "Business & Management",
  unsure: "Deciding later",
};

// pdfkit's standard fonts only cover the WinAnsi range, so any other glyph
// (rupee sign, fancy dashes, etc.) has to be normalised before it is drawn.
const sanitize = (value) =>
  String(value ?? "")
    .replace(/\u20B9/g, "Rs. ")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/[^\t\n\r\x20-\x7E\u00A0-\u00FF]/g, "?");

const truncate = (value, max = 320) => {
  const str = String(value ?? "");
  return str.length > max ? `${str.slice(0, max - 3)}...` : str;
};

const parseTrainings = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Deterministic, human-readable identifier derived from the application id so
// the same invoice number is produced on every retry or re-generation.
export const getMembershipInvoiceNumber = (membership = {}) => {
  const year = membership.createdAt
    ? new Date(membership.createdAt).getFullYear()
    : new Date().getFullYear();
  const id =
    membership.id != null ? String(membership.id).padStart(5, "0") : "00000";
  return `MU-INV-${year}-${id}`;
};

const STATUS_LABELS = {
  PENDING: "Payment pending verification",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

const buildInvoiceContext = (membership = {}, meta = {}) => {
  const labels = meta.labels || {};

  // An invoice is issued as soon as the member submits their application so
  // they have a record of the payment they made. It is re-issued with a
  // "verified" badge once an admin confirms the payment. `meta.status` lets
  // the caller override the row status when the PDF is generated before the
  // final database state is written.
  const status = String(meta.status || membership.status || "APPROVED")
    .trim()
    .toUpperCase();
  const isVerified = status === "APPROVED";

  const levelSlug = membership.membership_type || "";
  const levelLabel =
    labels[levelSlug] ||
    LEVEL_LABELS[levelSlug] ||
    membership.membership_type ||
    "Membership";

  const fieldSlug = membership.career_field || "";
  let fieldLabel = "-";
  if (fieldSlug) {
    fieldLabel =
      fieldSlug === "unsure"
        ? "Deciding later"
        : labels[fieldSlug] || FIELD_LABELS[fieldSlug] || fieldSlug;
  }

  const paymentLabel = membership.payment_method
    ? labels[membership.payment_method] || membership.payment_method
    : "-";

  const fee =
    membership.membership_fee || meta.levelFee || meta.fee || "-";

  const trainings = parseTrainings(membership.selected_trainings);

  const issuedDate = formatDate(membership.updatedAt || membership.createdAt) ||
    formatDate(new Date());

  return {
    invoiceNumber: getMembershipInvoiceNumber(membership),
    issuedDate,
    status,
    statusLabel: STATUS_LABELS[status] || status,
    isVerified,
    referenceId: membership.reference_id || `#${membership.id}`,
    applicationId: membership.id != null ? String(membership.id) : "-",
    memberName: membership.student_name || membership.student?.firstName || "MeroUni Member",
    memberEmail: membership.student_email || membership.student?.email || null,
    memberPhone: membership.student_phone_no || membership.student?.phoneNo || null,
    institution: membership.institution || null,
    levelLabel,
    fieldLabel,
    paymentLabel,
    fee,
    trainings,
    startDate: formatDate(membership.start_date),
    endDate: formatDate(membership.end_date),
    remarks: membership.remarks ? truncate(membership.remarks) : null,
  };
};

const hr = (doc, x1, y, x2, color = LINE) => {
  doc
    .moveTo(x1, y)
    .lineTo(x2, y)
    .strokeColor(color)
    .lineWidth(1)
    .stroke();
};

const drawPill = (doc, x, y, label, { bg, color, fontSize = 8.5 } = {}) => {
  doc.font("Helvetica-Bold").fontSize(fontSize);
  const textWidth = doc.widthOfString(label);
  const padX = 8;
  const height = 18;
  doc.roundedRect(x, y, textWidth + padX * 2, height, 9).fill(bg);
  doc
    .fillColor(color)
    .text(label, x + padX, y + 5.5, { lineBreak: false });
  return textWidth + padX * 2;
};

const renderInvoice = (doc, ctx) => {
  const pageWidth = doc.page.width;
  const left = PAGE_MARGIN;
  const right = pageWidth - PAGE_MARGIN;
  const contentWidth = right - left;

  // Full-bleed brand accent along the top edge.
  doc.rect(0, 0, pageWidth, 6).fill(BRAND);

  // ---- Header --------------------------------------------------------------
  const headerY = 42;

  doc.font("Helvetica-Bold").fontSize(22).fillColor(BRAND_DARK);
  doc.text("MeroUni", left, headerY);

  doc.font("Helvetica").fontSize(9).fillColor(MUTED);
  doc.text("merouni.com  |  Student Membership", left, headerY + 28);

  drawPill(doc, left, headerY + 46, ctx.isVerified ? "PAYMENT VERIFIED" : "PAYMENT PENDING", {
    bg: ctx.isVerified ? GREEN_BG : AMBER_BG,
    color: ctx.isVerified ? GREEN : AMBER,
  });

  doc.font("Helvetica-Bold").fontSize(24).fillColor(INK);
  doc.text("INVOICE", left, headerY, { width: contentWidth, align: "right" });

  doc.font("Helvetica").fontSize(9.5).fillColor(MUTED);
  doc.text(`Invoice no. ${ctx.invoiceNumber}`, left, headerY + 32, {
    width: contentWidth,
    align: "right",
  });
  doc.text(`Issued ${ctx.issuedDate}`, left, headerY + 46, {
    width: contentWidth,
    align: "right",
  });

  let y = 118;
  hr(doc, left, y, right);
  y += 18;

  // ---- Bill to / payment details ------------------------------------------
  const colGap = 24;
  const colWidth = (contentWidth - colGap) / 2;
  const rightColX = left + colWidth + colGap;

  doc.font("Helvetica-Bold").fontSize(9).fillColor(BRAND);
  doc.text("BILLED TO", left, y);
  doc.text("PAYMENT DETAILS", rightColX, y);

  const sectionTop = y + 16;

  const drawInfoLines = (x, startY, lines) => {
    let lineY = startY;
    lines.forEach(([value, isFirst]) => {
      if (value === null || value === undefined || value === "") return;
      doc.font(isFirst ? "Helvetica-Bold" : "Helvetica").fontSize(isFirst ? 11 : 9.5);
      doc.fillColor(isFirst ? INK : MUTED);
      doc.text(sanitize(value), x, lineY, { width: colWidth });
      lineY = doc.y + (isFirst ? 4 : 2);
    });
    return lineY;
  };

  const leftEnd = drawInfoLines(left, sectionTop, [
    [ctx.memberName, true],
    [ctx.memberEmail],
    [ctx.memberPhone],
    [ctx.institution ? `Institution: ${ctx.institution}` : null],
  ]);

  const rightEnd = drawInfoLines(rightColX, sectionTop, [
    [`Payment method: ${ctx.paymentLabel}`],
    [`Payment reference: ${ctx.referenceId}`],
    [`Application ID: ${ctx.applicationId}`],
    [`Status: ${ctx.statusLabel}`],
  ]);

  y = Math.max(leftEnd, rightEnd) + 16;

  // ---- Line items ----------------------------------------------------------
  const amountColWidth = 120;
  const descWidth = contentWidth - amountColWidth - 16;

  doc.rect(left, y, contentWidth, 26).fill(SOFT);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(MUTED);
  doc.text("DESCRIPTION", left + 12, y + 9);
  doc.text("AMOUNT", left, y + 9, { width: contentWidth - 12, align: "right" });
  y += 26;

  hr(doc, left, y, right);

  // Primary row: the membership itself.
  const rowPadTop = 14;
  const rowPadBottom = 14;

  doc.font("Helvetica-Bold").fontSize(11).fillColor(INK);
  const titleHeight = doc.heightOfString(
    sanitize(`${ctx.levelLabel} Membership`),
    { width: descWidth }
  );
  doc.font("Helvetica").fontSize(9.5);
  const subtitleHeight = doc.heightOfString(
    `Career field: ${sanitize(ctx.fieldLabel)}`,
    { width: descWidth }
  );
  const mainRowHeight = rowPadTop + titleHeight + 4 + subtitleHeight + rowPadBottom;

  doc.font("Helvetica-Bold").fontSize(11).fillColor(INK);
  doc.text(sanitize(`${ctx.levelLabel} Membership`), left + 12, y + rowPadTop, {
    width: descWidth,
  });
  doc.font("Helvetica").fontSize(9.5).fillColor(MUTED);
  doc.text(
    `Career field: ${sanitize(ctx.fieldLabel)}`,
    left + 12,
    y + rowPadTop + titleHeight + 4,
    { width: descWidth }
  );
  doc.font("Helvetica-Bold").fontSize(11).fillColor(INK);
  doc.text(sanitize(ctx.fee), left, y + rowPadTop, {
    width: contentWidth - 12,
    align: "right",
  });

  y += mainRowHeight;
  hr(doc, left, y, right);

  // Included trainings row (no extra charge, but listed for the member's records).
  if (ctx.trainings.length) {
    const shown = ctx.trainings.slice(0, 10);
    const extra = ctx.trainings.length - shown.length;

    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK);
    const headHeight = doc.heightOfString("Included trainings", { width: descWidth });

    const bulletText = shown
      .map((training) => `• ${sanitize(typeof training === "string" ? training : training?.t || training?.title || "")}`)
      .filter((line) => line !== "• ")
      .join("\n");

    doc.font("Helvetica").fontSize(9.5);
    const bulletHeight = bulletText
      ? doc.heightOfString(bulletText, { width: descWidth, lineGap: 2 })
      : 0;

    const trainingRowHeight = rowPadTop + headHeight + 6 + bulletHeight + rowPadBottom;

    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK);
    doc.text("Included trainings", left + 12, y + rowPadTop, { width: descWidth });

    let bulletY = y + rowPadTop + headHeight + 6;
    if (bulletText) {
      doc.font("Helvetica").fontSize(9.5).fillColor(MUTED);
      doc.text(bulletText, left + 12, bulletY, { width: descWidth, lineGap: 2 });
      bulletY = doc.y;
    }
    if (extra > 0) {
      doc.font("Helvetica-Oblique").fontSize(9).fillColor(MUTED);
      doc.text(`+ ${extra} more`, left + 12, bulletY + 2, { width: descWidth });
    }

    doc.font("Helvetica").fontSize(9.5).fillColor(MUTED);
    doc.text("Included", left, y + rowPadTop, {
      width: contentWidth - 12,
      align: "right",
    });

    y += trainingRowHeight;
    hr(doc, left, y, right);
  }

  // ---- Totals --------------------------------------------------------------
  y += 16;
  const totalsLabelX = left + contentWidth - 240;
  const totalsValueX = left + contentWidth - 140;
  const totalsWidth = 140;

  doc.font("Helvetica").fontSize(10).fillColor(MUTED);
  doc.text("Total", totalsLabelX, y, { width: 100 });
  doc.font("Helvetica-Bold").fontSize(12).fillColor(INK);
  doc.text(sanitize(ctx.fee), totalsValueX, y - 2, {
    width: totalsWidth,
    align: "right",
  });
  y += 24;

  // Amount strip. Pending applications show the amount due; verified payments
  // show the amount that has been received in full.
  const paidHeight = 30;
  const amountAccent = ctx.isVerified ? GREEN : AMBER;
  const amountAccentBg = ctx.isVerified ? GREEN_BG : AMBER_BG;
  doc
    .roundedRect(left + contentWidth - 260, y, 260, paidHeight, 8)
    .fill(amountAccentBg);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(amountAccent);
  doc.text(ctx.isVerified ? "Amount paid" : "Amount due", left + contentWidth - 248, y + 10);
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(amountAccent)
    .text(sanitize(ctx.fee), left, y + 10, {
      width: contentWidth - 12,
      align: "right",
    });

  y += paidHeight + 10;

  doc.font("Helvetica").fontSize(9.5).fillColor(MUTED);
  doc.text(
    ctx.isVerified
      ? "Balance due: 0"
      : `Balance due: ${sanitize(ctx.fee)} (awaiting payment verification)`,
    left,
    y,
    {
      width: contentWidth,
      align: "right",
    }
  );

  y += 22;

  // ---- Validity + remarks --------------------------------------------------
  if (ctx.startDate || ctx.endDate) {
    const validityHeight = 40;
    doc.rect(left, y, contentWidth, validityHeight).fill(SOFT);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(BRAND);
    doc.text("MEMBERSHIP VALIDITY", left + 12, y + 9);
    doc.font("Helvetica").fontSize(10).fillColor(INK);
    const from = ctx.startDate || "on approval";
    const until = ctx.endDate || "ongoing";
    doc.text(`${sanitize(from)}  -  ${sanitize(until)}`, left + 12, y + 22, {
      width: contentWidth - 24,
    });
    y += validityHeight + 14;
  }

  if (ctx.remarks) {
    doc.font("Helvetica-Bold").fontSize(9).fillColor(BRAND);
    doc.text("NOTES", left, y);
    doc.font("Helvetica").fontSize(9.5).fillColor(MUTED);
    doc.text(sanitize(ctx.remarks), left, y + 14, { width: contentWidth });
    y = doc.y + 12;
  }

  // ---- Footer --------------------------------------------------------------
  const footerY = Math.min(Math.max(y + 20, 730), 770);
  hr(doc, left, footerY, right);
  doc.font("Helvetica").fontSize(9).fillColor(MUTED);
  doc.text(
    ctx.isVerified
      ? "Thank you for joining MeroUni. This invoice confirms your membership payment has been verified and your membership is active."
      : "Thank you for joining MeroUni. This invoice records the payment you submitted. Your membership will be activated once our team verifies the payment.",
    left,
    footerY + 12,
    { width: contentWidth }
  );
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(MUTED)
    .text(
      `This is a computer-generated invoice and does not require a signature. Keep reference ${sanitize(
        ctx.referenceId
      )} for future correspondence.`,
      left,
      doc.y + 8,
      { width: contentWidth }
    );
};

// Renders the membership invoice and resolves with a Buffer. Uses pdfkit's
// built-in fonts only, so no font files need to ship with the app.
export const buildMembershipInvoicePdf = (membership = {}, meta = {}) =>
  new Promise((resolve, reject) => {
    try {
      const ctx = buildInvoiceContext(membership, meta);
      const doc = new PDFDocument({
        size: "A4",
        margin: PAGE_MARGIN,
        info: {
          Title: `MeroUni Membership Invoice ${ctx.invoiceNumber}`,
          Author: "MeroUni",
          Subject: "Student Membership Invoice",
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      renderInvoice(doc, ctx);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });

export default buildMembershipInvoicePdf;
