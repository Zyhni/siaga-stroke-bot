// src/auth.js
export function requireAuth(req, res, next) {
  if (req.session?.user) return next();
  return res.redirect("/login");
}

export function loginHandler(req, res) {
  const { username, password } = req.body || {};
  const u = process.env.DASH_USER;
  const p = process.env.DASH_PASS;

  if (username === u && password === p) {
    req.session.user = { username };
    return res.redirect("/dashboard");
  }
  return res.status(401).send("Login gagal");
}

export function logoutHandler(req, res) {
  req.session.destroy(() => res.redirect("/login"));
}