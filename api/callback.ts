/**
 * GET /api/callback — step 2 of the CMS login. Exchanges GitHub's `code` for an access
 * token and hands it to the Decap CMS window (/admin/) via postMessage, using Decap's
 * "authorization:github:success:{…}" protocol.
 *
 * Env: GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET.
 */

const page = (status: "success" | "error", content: Record<string, string>, httpStatus = 200) => {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Signing in…</title><body>
<p>${status === "success" ? "Signed in. You can close this window." : "Sign-in failed. Please close this window and try again."}</p>
<script>
(function () {
  var message = ${JSON.stringify(message)};
  function receive(e) {
    if (!window.opener) return;
    window.opener.postMessage(message, e.origin);
    window.removeEventListener("message", receive, false);
    setTimeout(function () { window.close(); }, 500);
  }
  window.addEventListener("message", receive, false);
  if (window.opener) window.opener.postMessage("authorizing:github", "*");
})();
</script></body></html>`;
  return new Response(html, {
    status: httpStatus,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Set-Cookie": "cms_oauth_state=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Lax" },
  });
};

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = /(?:^|;\s*)cms_oauth_state=([a-f0-9]+)/.exec(req.headers.get("cookie") ?? "")?.[1];
  if (!code || !state || !cookie || state !== cookie) return page("error", { message: "Invalid login state" }, 400);

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  }).catch(() => null);
  const data = (await res?.json().catch(() => null)) as { access_token?: string; error_description?: string } | null;
  if (!data?.access_token) return page("error", { message: data?.error_description ?? "GitHub did not return a token" }, 502);
  return page("success", { token: data.access_token, provider: "github" });
}
