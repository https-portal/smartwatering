const admin = require("firebase-admin");
const express = require("express");
const app = express();

// Allow Express to parse JSON
app.use(express.json());

// Firebase Admin initialization
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.CLIENT_EMAIL
  }),
  databaseURL: process.env.DATABASE_URL
});

const db = admin.database();

// ----------------- Topic Subscription Endpoint -----------------
app.post('/subscribe', async (req, res) => {
  const { token, topic } = req.body;
  try {
    await admin.messaging().subscribeToTopic(token, topic);
    console.log(`Token subscribed to topic ${topic}`);
    res.send({ success: true });
  } catch (err) {
    console.error("Subscription error:", err);
    res.status(500).send({ success: false, error: err.message });
  }
});

// ----------------- Plant Moisture Notifications -----------------
let plant1Alerted = false;
let plant2Alerted = false;

// Plant 1
db.ref('Plant1Moisture').on('value', snap => {
  const val = snap.val()?.percent || 0;
  if(val < 30 && !plant1Alerted){
    plant1Alerted = true;
    admin.messaging().send({
      notification: { title: "🌱 Plant 1 Dry!", body: "Moisture below 30%" },
      topic: "plantAlerts"
    }).then(console.log).catch(console.error);
  } else if(val >= 30) plant1Alerted = false;
});

// Plant 2
db.ref('Plant2Moisture').on('value', snap => {
  const val = snap.val()?.percent || 0;
  if(val < 30 && !plant2Alerted){
    plant2Alerted = true;
    admin.messaging().send({
      notification: { title: "🌿 Plant 2 Dry!", body: "Moisture below 30%" },
      topic: "plantAlerts"
    }).then(console.log).catch(console.error);
  } else if(val >= 30) plant2Alerted = false;
});

// ----------------- Basic Express Route -----------------
const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Notifier running"));
app.listen(port, () => console.log(`Server listening on port ${port}`));
