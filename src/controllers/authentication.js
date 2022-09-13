const signupIndex = (req, res) => res.render("auth/signup");

const profileIndex = (req, res) => {
  res.render("profile", { ip: req.ip });
};

const signinIndex = (req, res) => {
  res.render("auth/signin");
};

const logoutIndex = (req, res) => {
  req.logOut();
  res.redirect("/signin");
};

module.exports = {
    signinIndex, profileIndex, signinIndex, logoutIndex
}