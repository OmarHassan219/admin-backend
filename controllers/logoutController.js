const User = require("../model/information");
const admin = require("firebase-admin");

const handleLogout = async (req, res) => {
    const {username} = req.body
    // console.log(username);
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: "true",
    });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );
  const result = await foundUser.save();
  admin.app().delete();
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: "true" }); // secure : true - only servers on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
