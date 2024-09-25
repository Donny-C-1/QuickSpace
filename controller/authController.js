function displaySignupPage(req, res) {
  res.render("auth");
}

function handleSignupLogin(req, res) {
  res.redirect("/drive");
}

function displayLoginPage(req, res) {
  res.render("auth");
}

export { displaySignupPage, displayLoginPage, handleSignupLogin };
