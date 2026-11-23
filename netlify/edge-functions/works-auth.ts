// /works/ をパスワードで守る Netlify Edge Function。
// パスワードを変えるとき：ターミナルで
//   printf '新しいパスワード' | shasum -a 256
// を実行し、出てきた64文字を PASSWORD_SHA256 に貼って push する。

const PASSWORD_SHA256 = "f91b5249aa51aeaaf35c8ec899ded1b72d1e2c2b26c32173aa8a315dbdd347c8";
const COOKIE = "works_auth";

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function form(wrong: boolean): Response {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>SHOTARONEXT — Works</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#000;color:#eee;font:15px/1.6 "Helvetica Neue",Arial,sans-serif}
form{display:flex;flex-direction:column;gap:14px;width:min(320px,86vw)}
h1{margin:0 0 6px;font-weight:300;font-style:italic;letter-spacing:.08em;font-size:22px}
p{margin:0;color:#888;font-size:13px}
input{font:inherit;padding:10px 12px;background:#111;color:#eee;border:1px solid #333;border-radius:2px}
button{font:inherit;padding:10px 12px;background:#eee;color:#000;border:0;border-radius:2px;cursor:pointer}
.err{color:#e07a6a}
</style></head><body>
<form method="POST">
<h1>SHOTARONEXT</h1>
<p>Selected works. Please enter the password.</p>
<input type="password" name="password" autocomplete="current-password" autofocus aria-label="Password" required>
${wrong ? '<p class="err">That password is not right.</p>' : ""}
<button type="submit">Enter</button>
</form></body></html>`;
  return new Response(html, {
    status: wrong ? 401 : 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`${COOKIE}=([a-f0-9]{64})`));
  if (match && match[1] === PASSWORD_SHA256) {
    const res = await context.next();
    const out = new Response(res.body, res);
    out.headers.set("cache-control", "private, no-store");
    out.headers.set("x-robots-tag", "noindex");
    return out;
  }

  if (request.method === "POST") {
    const data = await request.formData();
    const hash = await sha256(String(data.get("password") ?? ""));
    if (hash === PASSWORD_SHA256) {
      return new Response(null, {
        status: 303,
        headers: {
          location: new URL(request.url).pathname,
          "set-cookie": `${COOKIE}=${hash}; Path=/works; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }
    return form(true);
  }

  return form(false);
};

export const config = { path: ["/works", "/works/*"] };
