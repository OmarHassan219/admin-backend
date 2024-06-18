// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require("../model/information")
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const handleRefreshToken = async (req, res) => {

  const {username} = req.body;
  const cookies = req.cookies;
// console.log(cookies);
  // console.log(cookies.jwt);
  if (!cookies?.jwt) {
  admin.app(username).delete();
  return res.sendStatus(401);

  }
  const refreshToken = cookies.jwt;
  res.clearCookie('jwt',{httpOnly:true , sameSite:'strict',secure:false}) // secure : true - only servers on https

  // const foundUser = usersDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );
  // console.log("ref" , refreshToken);

  const foundUser = await User.findOne({refreshToken}).exec()

  //Detected refresh token reuse !
// console.log("yesss" , foundUser);





//   if (!foundUser) {
//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       async (err, decoded) => {
       
//         if(err) return res.sendStatus(403); //unauthorized
           
//         const hackedUser = await User.findOne({username: decoded.username}).exec()
//         hackedUser.refreshToken =[]
//         const result = await hackedUser.save()
//         // console.log(result) 

//       }
//       )
      
//       return res.sendStatus(403); //Forbidden
// }


const newRefreshTokens = foundUser.refreshToken.filter(token => token !== refreshToken);



  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    async (err, decoded) => {
      if(err){
        foundUser.refreshToken = [...newRefreshTokens]
        const result = await foundUser.save()
      }

if(err || foundUser.username !== decoded.username) return res.sendStatus(403); 

//Refresh Token is still valid 
const accessToken = jwt.sign({ username: foundUser.username , firebaseConfig: foundUser.firebaseConfig }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' });



const newRefreshToken = jwt.sign(
  { username: foundUser.username },
  process.env.REFRESH_TOKEN_SECRET_KEY,
  { expiresIn: "4d" }
);
foundUser.refreshToken = [...newRefreshTokens , newRefreshToken];
const result = await foundUser.save()

res.cookie("jwt", newRefreshToken, {
  httpOnly: true,
  sameSite: "strict",
  secure: false,
  maxAge: 24 * 60 * 60 * 1000,
});
res.json({accessToken })

    }
  );

};

module.exports = { handleRefreshToken};
