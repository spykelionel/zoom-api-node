const KJUR = require("jsrsasign");
require("dotenv").config();

const middleware = {
  generateToken: function (req, res, next) {
    let signature = "";
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; // 1 hour
    const oHeader = { alg: "HS256", typ: "JWT" };
    console.log(req.body);

    const { topic, password, userIdentity, sessionKey, roleType } = req.body;
    const sdkKey = process.env.ZOOM_SDK_KEY;
    const secretKey = process.env.ZOOM_SDK_SECRET;

    // Initialize zoom payload object
    const payload = {
      app_key: sdkKey,
      sub: req.body.userId,
      iat,
      exp,
      tpc: topic,
      pwd: password,
      user_identity: userIdentity,
      session_key: sessionKey,
      role_type: roleType,
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(payload);
    signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secretKey);

    // save the signature to res.locals
    res.locals.signature = signature;
    next();
  },
};

module.exports = middleware;
