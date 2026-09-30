import { sendMail } from "./Mail.util.js";

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

const buildEmailHtml = ({ memberName, referenceId, levelLabel, fieldLabel, trainings, startDate, endDate }) => {
  const details = [
    ["Reference", referenceId, true],
    ["Membership level", levelLabel],
    ["Career field", fieldLabel],
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

  return `<div style="margin:0;padding:24px 0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="padding:28px 32px 8px;">
        <p style="margin:0 0 4px;color:#387cae;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">MeroUni Membership</p>
        <h1 style="margin:0 0 12px;color:#0f172a;font-size:24px;line-height:1.25;">Your payment is verified</h1>
        <p style="margin:0;color:#475569;font-size:15px;line-height:1.65;">
          Hi ${escapeHtml(memberName)}, we have received and verified your membership payment.
          Your membership is now active.
        </p>
      </div>
      <div style="padding:20px 32px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
          ${detailRows}
        </table>
        ${trainingBlock}
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
  trainings,
  startDate,
  endDate,
}) => {
  const lines = [
    `Your MeroUni membership payment is verified`,
    ``,
    `Hi ${memberName},`,
    `We have received and verified your membership payment. Your membership is now active.`,
    ``,
    `Reference: ${referenceId}`,
    `Membership level: ${levelLabel}`,
    `Career field: ${fieldLabel}`,
  ];

  if (startDate) lines.push(`Valid from: ${startDate}`);
  if (endDate) lines.push(`Valid until: ${endDate}`);

  if (trainings.length) {
    lines.push(``, `Your trainings:`);
    trainings.forEach((t) => lines.push(`  - ${t}`));
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

export const sendMembershipApprovedEmail = async (membership) => {
  const recipient = resolveRecipient(membership);
  if (!recipient) {
    console.warn(
      `[MembershipMail] No email on membership ${membership.reference_id || membership.id} — approval email skipped`
    );
    return { skipped: true };
  }

  const context = {
    memberName: membership.student_name || "there",
    referenceId: membership.reference_id || `#${membership.id}`,
    levelLabel: LEVEL_LABELS[membership.membership_type] || membership.membership_type,
    fieldLabel: FIELD_LABELS[membership.career_field] || membership.career_field || "—",
    trainings: parseTrainings(membership.selected_trainings),
    startDate: formatDate(membership.start_date),
    endDate: formatDate(membership.end_date),
  };

  return sendMail(
    recipient,
    `Your MeroUni membership is active — ${context.referenceId}`,
    buildEmailText(context),
    buildEmailHtml(context)
  );
};
