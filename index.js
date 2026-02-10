const admin = require("firebase-admin");
const express = require("express");
const app = express();

// Use env variables from Railway
const databaseURL = process.env.DATABASE_URL;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.CLIENT_EMAIL
  }),
  databaseURL: databaseURL
});

// Ping endpoint to keep Railway alive
const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Notifier running"));
app.listen(port, () => console.log(`Server listening on port ${port}`));

// --- Firebase Database watcher for notifications ---
const db = admin.database();
let plant1Alerted = false;
let plant2Alerted = false;

// Helper to safely get percent or default to 0
function getPercent(snapshot) {
  try {
    const val = snapshot.val();
    if (val && typeof val.percent === "number") return val.percent;
    return 0; // default if missing
  } catch (err) {
    console.error("Error reading snapshot:", err);
    return 0;
  }
}

// Plant 1 watcher
db.ref('Plant1Moisture').on('value', snap => {
  const val = getPercent(snap);
  console.log("Plant1 moisture:", val);

  if(val < 30 && !plant1Alerted){
    plant1Alerted = true;
    admin.messaging().send({
      notification: { title: "🌱 Plant 1 Dry!", body: `Moisture below 30% (${val}%)` },
      topic: "plantAlerts"
    }).then(console.log).catch(console.error);
  } else if(val >= 30) plant1Alerted = false;
});

// Plant 2 watcher
db.ref('Plant2Moisture').on('value', snap => {
  const val = getPercent(snap);
  console.log("Plant2 moisture:", val);

  if(val < 30 && !plant2Alerted){
    plant2Alerted = true;
    admin.messaging().send({
      notification: { title: "🌿 Plant 2 Dry!", body: `Moisture below 30% (${val}%)` },
      topic: "plantAlerts"
    }).then(console.log).catch(console.error);
  } else if(val >= 30) plant2Alerted = false;
});

// Optional: Safe heartbeat log
setInterval(() => {
  console.log("Heartbeat check - Plant1Alerted:", plant1Alerted, "Plant2Alerted:", plant2Alerted);
}, 30000);
