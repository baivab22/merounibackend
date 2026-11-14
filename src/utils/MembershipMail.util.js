import { sendMail } from "./Mail.util.js";
import {
  buildMembershipInvoicePdf,
  getMembershipInvoiceNumber,
} from "./MembershipInvoice.util.js";

// Members' names, institutions and training titles are free text that lands in
// an HTML email, so every interpolated value has to be escaped.
const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const LEVEL_LABELS = {
  PLUS2: "+2 / Grade 12",
  BACHELORS: "Bachelor's — Running",
  GRADUATE: "Graduate",
};

const FIELD_LABELS = {
  it: "Information Technology",
  hospitality: "Hospitality Management",
  business: "Business & Management",
  unsure: "Deciding later",
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

const parseTrainings = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const buildEmailHtml = ({
  memberName,
  referenceId,
  levelLabel,
  fieldLabel,
  paymentLabel,
  invoiceNumber,
  invoiceAttached,
  trainings,
  startDate,
  endDate,
  heading,
  intro,
  invoiceTone = "success",
}) => {
  const details = [
    ["Reference", referenceId, true],
    invoiceNumber ? ["Invoice", invoiceNumber] : null,
    ["Membership level", levelLabel],
    ["Career field", fieldLabel],
    paymentLabel ? ["Payment method", paymentLabel] : null,
    startDate ? ["Valid from", startDate] : null,
    endDate ? ["Valid until", endDate] : null,
  ].filter(Boolean);

  const detailRows = details
    .map(
      ([label, value, mono]) => `<tr>
        <td style="padding:8px 16px 8px 0;color:#64748b;font-size:14px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;${
          mono ? "font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:0.04em;" : ""
        }">${escapeHtml(value)}</td>
      </tr>`
    )
    .join("");

  const trainingBlock = trainings.length
    ? `<div style="margin:24px 0 0;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
        <p style="margin:0 0 8px;color:#387cae;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Your trainings</p>
        <ul style="margin:0;padding-left:18px;color:#334155;font-size:14px;line-height:1.7;">
          ${trainings.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}
        </ul>
      </div>`
    : "";

  const invoicePalette =
    invoiceTone === "pending"
      ? { bg: "#fffbeb", border: "#fde68a", color: "#b45309" }
      : { bg: "#ecfdf5", border: "#bbf7d0", color: "#15803d" };

  const invoiceBlock = invoiceAttached
    ? `<div style="margin:24px 0 0;padding:14px 16px;background:${invoicePalette.bg};border:1px solid ${invoicePalette.border};border-radius:12px;">
        <p style="margin:0;color:${invoicePalette.color};font-size:14px;line-height:1.6;">
          <strong>Your PDF invoice is attached</strong>${
            invoiceNumber ? ` (${escapeHtml(invoiceNumber)})` : ""
          } to this email. Keep it for your records.
        </p>
      </div>`
    : "";

  return `<div style="margin:0;padding:24px 0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="padding:28px 32px 8px;">
        <p style="margin:0 0 4px;color:#387cae;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">MeroUni Membership</p>
        <h1 style="margin:0 0 12px;color:#0f172a;font-size:24px;line-height:1.25;">${escapeHtml(heading)}</h1>
        <p style="margin:0;color:#475569;font-size:15px;line-height:1.65;">
          Hi ${escapeHtml(memberName)}, ${escapeHtml(intro)}
        </p>
      </div>
      <div style="padding:20px 32px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
          ${detailRows}
        </table>
        ${trainingBlock}
        ${invoiceBlock}
        <p style="margin:24px 0 0;color:#475569;font-size:14px;line-height:1.65;">
          Keep your reference <strong style="color:#0f172a;">${escapeHtml(referenceId)}</strong> handy — quote it in any future
          correspondence about this membership.
        </p>
        <p style="margin:16px 0 0;color:#475569;font-size:14px;line-height:1.65;">
          Need anything? Just reply to this email.
        </p>
      </div>
      <div style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
          You are receiving this because you applied for a MeroUni membership
          (${escapeHtml(referenceId)}).
        </p>
      </div>
    </div>
  </div>`;
};

const buildEmailText = ({
  memberName,
  referenceId,
  levelLabel,
  fieldLabel,
  paymentLabel,
  invoiceNumber,
  invoiceAttached,
  trainings,
  startDate,
  endDate,
  heading,
  intro,
}) => {
  const lines = [
    heading,
    ``,
    `Hi ${memberName},`,
    intro,
    ``,
    `Reference: ${referenceId}`,
  ];

  if (invoiceNumber) lines.push(`Invoice: ${invoiceNumber}`);
  lines.push(`Membership level: ${levelLabel}`);
  lines.push(`Career field: ${fieldLabel}`);
  if (paymentLabel) lines.push(`Payment method: ${paymentLabel}`);

  if (startDate) lines.push(`Valid from: ${startDate}`);
  if (endDate) lines.push(`Valid until: ${endDate}`);

  if (trainings.length) {
    lines.push(``, `Your trainings:`);
    trainings.forEach((t) => lines.push(`  - ${t}`));
  }

  if (invoiceAttached) {
    lines.push(
      ``,
      `Your PDF invoice is attached to this email. Keep it for your records.`
    );
  }

  lines.push(
    ``,
    `Keep your reference ${referenceId} handy — quote it in any future correspondence about this membership.`,
    `Need anything? Just reply to this email.`
  );

  return lines.join("\n");
};

// Resolves the recipient from the denormalised snapshot first, then the linked
// user record. Guest applications can legitimately have no email at all, in
// which case we skip rather than fail the admin's approval.
const resolveRecipient = (membership) =>
  membership.student_email || membership.student?.email || null;

const buildMailContext = (membership, meta = {}) => {
  const labels = meta.labels || {};

  return {
    memberName: membership.student_name || "there",
    referenceId: membership.reference_id || `#${membership.id}`,
    levelLabel:
      labels[membership.membership_type] ||
      LEVEL_LABELS[membership.membership_type] ||
      membership.membership_type,
    fieldLabel:
      labels[membership.career_field] ||
      FIELD_LABELS[membership.career_field] ||
      membership.career_field ||
      "—",
    paymentLabel: membership.payment_method
      ? labels[membership.payment_method] || membership.payment_method
      : null,
    invoiceNumber: getMembershipInvoiceNumber(membership),
    trainings: parseTrainings(membership.selected_trainings),
    startDate: formatDate(membership.start_date),
    endDate: formatDate(membership.end_date),
  };
};

// Shared by the "application received" receipt and the "payment verified"
// confirmation. The PDF invoice is a bonus on top of the notification, so a
// rendering failure must never stop the member from being emailed.
const sendMembershipEmail = async (
  membership,
  meta = {},
  { invoiceStatus, heading, intro, subject, invoiceTone = "success" } = {}
) => {
  const recipient = resolveRecipient(membership);
  if (!recipient) {
    console.warn(
      `[MembershipMail] No email on membership ${membership.reference_id || membership.id} — email skipped`
    );
    return { skipped: true };
  }

  const context = {
    ...buildMailContext(membership, meta),
    heading,
    intro,
    invoiceTone,
  };

  let attachments = [];
  try {
    const invoicePdf = await buildMembershipInvoicePdf(membership, {
      ...meta,
      status: invoiceStatus,
    });
    attachments = [
      {
        filename: `${context.invoiceNumber}.pdf`,
        content: invoicePdf,
        contentType: "application/pdf",
      },
    ];
    context.invoiceAttached = true;
  } catch (invoiceError) {
    context.invoiceAttached = false;
    console.error(
      `[MembershipMail] Invoice generation failed for ${context.referenceId}:`,
      invoiceError.message
    );
  }

  return sendMail(
    recipient,
    subject(context),
    buildEmailText(context),
    buildEmailHtml(context),
    attachments
  );
};

// Sent when the member submits their application and payment proof. They get
// an invoice immediately so the payment is on record while an admin verifies it.
export const sendMembershipApplicationEmail = (membership, meta = {}) =>
  sendMembershipEmail(membership, meta, {
    invoiceStatus: "PENDING",
    heading: "Your application is in",
    intro:
      "we have received your MeroUni membership application and payment proof. Our team will verify the payment and activate your membership shortly. Your invoice is attached for your records.",
    subject: (ctx) =>
      `MeroUni membership application received — ${ctx.referenceId}`,
    invoiceTone: "pending",
  });

// Sent when an admin matches the member's payment and approves the membership.
export const sendMembershipApprovedEmail = (membership, meta = {}) =>
  sendMembershipEmail(membership, meta, {
    invoiceStatus: "APPROVED",
    heading: "Your payment is verified",
    intro:
      "we have received and verified your membership payment. Your membership is now active.",
    subject: (ctx) => `Your MeroUni membership is active — ${ctx.referenceId}`,
    invoiceTone: "success",
  });
