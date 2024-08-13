const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

const middleware = {
  generateAuthUrl: (req, res, next) => {
    const authUrl =
      "https://zoom.us/oauth/authorize?" +
      qs.stringify({
        response_type: "code",
        client_id: process.env.ZOOM_CLIENT_ID,
        redirect_uri: process.env.ZOOM_REDIRECT_URI,
      });
    res.locals.authUrl = authUrl;
    next();
  },

  exchangeCodeForToken: async (req, res, next) => {
    const { code } = req.query;
    try {
      const response = await axios.post(
        "https://zoom.us/oauth/token",
        qs.stringify({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.ZOOM_REDIRECT_URI,
        }),
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                process.env.ZOOM_CLIENT_ID +
                  ":" +
                  process.env.ZOOM_CLIENT_SECRET
              ).toString("base64"),
          },
        }
      );
      res.locals.token = response.data.access_token;
      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = middleware;
