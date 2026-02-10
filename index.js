const admin = require("firebase-admin");
const express = require("express");
const app = express();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.CLIENT_EMAIL
  }),
  databaseURL: process.env.DATABASE_URL
});

const db = admin.database();
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

const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Notifier running"));
app.listen(port, () => console.log(`Server listening on port ${port}`));
