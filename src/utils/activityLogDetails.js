/**
 * Build structured metadata for activity_logs.details (JSON).
 * Keeps payloads small and avoids secrets / huge blobs.
 */

const SENSITIVE_KEY = /password|token|secret|otp|authorization|cookie|refresh/i;

const BODY_LABEL_KEYS = [
  "name",
  "title",
  "slug",
  "slugs",
  "email",
  "firstName",
  "lastName",
  "fullname",
  "fullName",
  "phoneNo",
  "status",
  "code",
  "categoryId",
  "collegeId",
  "universityId",
  "consultancyId",
  "jobTitle",
  "degreeTitle",
  "eventTitle",
];

const QUERY_ID_KEYS = [
  "scholarship_id",
  "college_id",
  "user_id",
  "program_id",
  "course_id",
  "id",
  "slug",
  "slugs",
];

function truncate(str, max) {
  if (typeof str !== "string") return str;
  const t = str.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

function pickParams(params) {
  if (!params || typeof params !== "object") return {};
  const out = {};
  for (const [k, v] of Object.entries(params)) {
    if (SENSITIVE_KEY.test(k)) continue;
    if (v == null || v === "") continue;
    const s = String(v);
    if (s.length > 120) continue;
    out[k] = s;
  }
  return out;
}

function pickBodyLabels(body) {
  if (!body || typeof body !== "object") return {};
  const out = {};
  for (const key of BODY_LABEL_KEYS) {
    if (SENSITIVE_KEY.test(key)) continue;
    const val = body[key];
    if (val == null || val === "") continue;
    if (typeof val === "object") continue;
    const str = String(val).trim();
    if (!str) continue;
    out[key] = truncate(str, 100);
  }
  return out;
}

function pickQueryIds(query) {
  if (!query || typeof query !== "object") return {};
  const out = {};
  for (const k of QUERY_ID_KEYS) {
    if (SENSITIVE_KEY.test(k)) continue;
    const val = query[k];
    if (val == null || val === "") continue;
    const s = String(val);
    if (s.length > 80) continue;
    out[k] = s;
  }
  return out;
}

function combinedFullName(details) {
  const a = String(details.firstName || "").trim();
  const b = String(details.lastName || "").trim();
  const n = `${a} ${b}`.trim();
  return n || null;
}

/**
 * @param {import('express').Request} req
 * @param {string} resource - route segment (e.g. college, blog)
 * @param {string} action - Create | Update | Delete
 */
export function buildActivityLogDetails(req, resource, action) {
  const fromParams = pickParams(req.params || {});
  const fromBody = pickBodyLabels(req.body || {});
  const fromQuery = pickQueryIds(req.query || {});

  const details = {
    ...fromQuery,
    ...fromBody,
    ...fromParams,
  };

  details.summary = humanSummary(details, resource, action);

  return details;
}

function humanSummary(details, resource, action) {
  const id =
    details.id ||
    details.targetId ||
    details.scholarship_id ||
    details.user_id ||
    details.program_id ||
    details.course_id ||
    details.college_id ||
    null;

  const primaryLabel =
    firstNonEmpty([
      details.jobTitle,
      details.degreeTitle,
      details.eventTitle,
      details.title,
      details.name,
      combinedFullName(details),
      details.fullname,
      details.fullName,
      details.slug,
      details.slugs,
      details.code,
      details.email,
    ]);

  const res =
    resource && resource !== "unknown"
      ? truncate(resource.replace(/-/g, " "), 40)
      : null;

  const parts = [];
  if (primaryLabel) parts.push(`"${truncate(primaryLabel, 70)}"`);
  if (id != null && id !== "") parts.push(`id ${id}`);
  if (parts.length === 0) {
    if (res) return `${action} · ${res}`;
    return action;
  }
  const core = parts.join(" · ");
  if (res) return `${core} · ${res}`;
  return `${core}`;
}

function firstNonEmpty(candidates) {
  for (const c of candidates) {
    if (c != null && String(c).trim() !== "") return String(c).trim();
  }
  return null;
}
