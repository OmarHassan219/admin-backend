const auth = require("../model/information"); // DB
const jwt = require('jsonwebtoken');
const admin = require("firebase-admin");
let adminInterface;

const initializeAdmin = (serviceAccount, databaseURL , username) => {
    const serviceAccountt = JSON.stringify(serviceAccount); // Stringify serviceAccount
  adminInterface = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountt)),
    databaseURL
  });
};

const handleNewUser = async (req, res) => {
  const { key, serviceAccount, username, databaseURL, firebaseConfig } = req.body;

  try {
    //encrypt the password
    //store the new user
    const result = await auth.create({
      key,
      serviceAccount,
      username,
      databaseURL,
      firebaseConfig
    });

    res.status(201).json({ success: `New user added successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const handleLogin = async (req, res) => {
    const { key } = req.body;
  
    try {
      const foundUser = await auth.findOne({ key }).exec();
  
      if (!foundUser) {
        return res.sendStatus(401); // Unauthorized
      } else {
          console.log(foundUser.username);
        initializeAdmin(foundUser.serviceAccount, foundUser.databaseURL ,foundUser.username );
        // Generate access token
        const accessToken = jwt.sign({ username: foundUser.username, firebaseConfig: foundUser.firebaseConfig }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' });
        // Generate refresh token
        const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET_KEY);
  
        // Save refresh token to user document
        foundUser.refreshToken.push(refreshToken);
        await foundUser.save();
  
        // Set refresh token cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'strict', secure: false }).json({ accessToken });

      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Internal server error
    }
};

  
  
  
module.exports = { handleNewUser, handleLogin, adminInterface };
