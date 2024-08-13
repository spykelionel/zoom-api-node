const express = require("express");
const cors = require("cors");
const app = express();
const middleware = require("./middleware");

app.use(express.json());
app.use(cors({}));
const PORT = 4000;

// post request
app.post("/generate", middleware.generateToken, (req, res) => {
  res.status(200).json(res.locals.signature);
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
