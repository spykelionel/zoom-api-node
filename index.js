const express = require("express");
const cors = require("cors");
const KJUR = require("jsrsasign");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({}));

// const apiKey = process.env.ZOOM_API_KEY;
// const apiSecret = process.env.ZOOM_API_SECRET;

// Endpoint to generate a signature
app.post("/api/getSignature", (req, res) => {
  let signature = "";
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60; // 1 hour
  const tokenExp = exp + iat * 60; //
  const oHeader = { alg: "HS256", typ: "JWT" };
  console.log(req.body);

  const { meetingNumber, role } = req.body;
  const sdkKey = process.env.ZOOM_API_KEY;
  const secretKey = process.env.ZOOM_API_SECRET;

  // Initialize zoom payload object
  const payload = {
    sdkKey: sdkKey,
    appKey: sdkKey,
    role: role,
    mn: meetingNumber,
    iat,
    exp,
    tokenExp,
  };
  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(payload);
  signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secretKey);
  res.json({ signature });
});

app.listen(4000, () =>
  console.log("Zoom Meeting SDK backend running on port 4000")
);
