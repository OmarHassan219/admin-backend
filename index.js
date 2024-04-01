const express = require('express');
const cors = require('cors');
const app = express();
const port = 443;
const admin = require("firebase-admin");

const serviceAccount = require("./fir-panel-9fbd7-firebase-adminsdk-i7100-d1cc64749f.json");

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
    const updates = req.body; // Assuming updates are sent in the request body
    console.log(updates);
    const config = admin.remoteConfig();
    await config.publishTemplate(updates);
    res.status(200).send("Template has been published");
  } catch (err) {
    res.status(500).send("Error updating remote config");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
