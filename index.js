const express = require('express');
const cors = require('cors');
const app = express();
const admin = require("firebase-admin");
const { updateSearchIndex } = require('./model/information');
require("dotenv").config();
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-panel-9fbd7-default-rtdb.firebaseio.com"
});




// Allow requests from localhost:3002 and https://admin-panel-ten-murex.vercel.app/
const corsOptions = {
  origin: ['http://localhost:3002', 'https://admin-panel-ten-murex.vercel.app']
};

app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("hello world!");
});

app.get("/remote-config", async (req, res) => {
  try {
    const config = admin.remoteConfig();
    await config.getTemplate().then((template) => {

        res.status(200).json(template);
    });
  } catch (err) {
    console.error('Unable to get template');
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post("/remote-config", async (req, res) => {
  try {
    const updates = req.body; 
    console.log(updates.version.versionNumber);
    const updatesCopy = {...updates}
    // updatesCopy.version.versionNumber++
    const config = admin.remoteConfig();
    await config.publishTemplate(updatesCopy);
    res.status(200).send("Template has been published");
  } catch (err) {
    res.status(500).send("Error updating remote config");
    console.log(err.message)
  }
});
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
