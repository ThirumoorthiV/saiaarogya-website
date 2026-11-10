/**
 * GET /api/auth — step 1 of the CMS login (Decap CMS "github" backend on Vercel).
 * Redirects the editor to GitHub to approve access, with a random `state` stored in a
 * short-lived cookie (checked in /api/callback to prevent login CSRF).
 *
 * Env: GITHUB_OAUTH_CLIENT_ID (GitHub → Settings → Developer settings → OAuth Apps;
 * callback URL https://www.saiaarogya.hospital/api/callback).
 */
import { randomBytes } from "node:crypto";

export function GET(req: Request): Response {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) return new Response("CMS login is not configured (GITHUB_OAUTH_CLIENT_ID).", { status: 503 });
  const state = randomBytes(16).toString("hex");
  const origin = new URL(req.url).origin;
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${origin}/api/callback`);
  url.searchParams.set("scope", "repo,user");
  url.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": `cms_oauth_state=${state}; Path=/api; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
      "Cache-Control": "no-store",
    },
  });
}
