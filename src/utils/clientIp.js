/**
 * Normalize IPv4 / IPv6 display (strip ::ffff: prefix from IPv4-mapped IPv6).
 */
function normalizeIp(ip) {
  if (!ip || typeof ip !== "string") return null;
  let s = ip.trim();
  if (!s) return null;
  if (s.startsWith("::ffff:")) s = s.slice(7);
  if (s.startsWith("[") && s.includes("]")) {
    s = s.slice(1, s.indexOf("]"));
  }
  return s || null;
}

/**
 * Client IP for logging behind reverse proxies (nginx, Cloudflare, ALB, etc.).
 * Uses the first address in `X-Forwarded-For`, then `X-Real-IP`, then Express `req.ip`
 * / the socket (so proxy-added headers win over 127.0.0.1 on the upstream hop).
 *
 * In production, set `trust proxy` in `index.js` and avoid exposing Node directly
 * to the internet so clients cannot spoof forwarded headers.
 */
export function getClientIp(req) {
  if (!req) return null;

  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const first = String(raw).split(",")[0]?.trim();
    if (first) {
      const n = normalizeIp(first);
      if (n) return n;
    }
  }

  const realIp = req.headers["x-real-ip"];
  if (realIp && typeof realIp === "string") {
    const n = normalizeIp(realIp.split(",")[0].trim());
    if (n) return n;
  }

  const fromExpress = req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress;
  if (fromExpress) return normalizeIp(String(fromExpress));

  return null;
}
