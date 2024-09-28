function displaySignupPage(req, res) {
  res.locals.authType = "signup";
  res.render("auth");
}

function handleSignupLogin(req, res) {
  res.redirect("/drive");
}

function displayLoginPage(req, res) {
  res.locals.authType = "login";
  res.render("auth");
}

export { displaySignupPage, displayLoginPage, handleSignupLogin };
