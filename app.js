const express = require("express");
const app = express();
const port = 8000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const cors = require('cors')

app.use(cors())

//session set up
const session = require("express-session");

//token
const jwt = require("jsonwebtoken");

//models

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const mongoose = require("mongoose");
const { json } = require("body-parser");
mongoose
  .connect(
    "mongodb+srv://AbanoubSaad:dev@cluster0.yoqimye.mongodb.net/TH-Light-store?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(process.env.PORT || port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })

  .catch((err) => {
    console.log(err);
  });

// Generate JWT token
const generateToken = (user) => {
  const secretKey = "marigerges-e3dadi-taio"; // Replace with your own secret key
  const payload = {
    userId: user._id,
    username: user.username,
    // Include any additional data you want in the token payload
  };
  const options = {
    expiresIn: "20h", // Token expiration time
  };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.session.token;

  if (!token) {
    return res.json({ msg: "No token provided" });
  }

  // Verify the token here
  const secretKey = "marigerges-e3dadi-taio"; // Replace with your own secret key

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }

    const userId = decoded.userId;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(401).send("Invalid token after decoded");
        }

        req.user = user;
        next();
      })
      .catch((err) => {
        console.error("Error verifying token:", err);
        res.status(500).send("An error occurred while verifying the token");
      });
  });
};

app.get("/", (req, res) => {
  res.send("TH Light store homepage");
});

//================ routes =========================================
const finalProductRoutes = require("./routes/finalProductRoutes");
const matrialRoutes = require("./routes/matrialRoutes");
const materialsReportRoutes = require('./routes/materialsReportsRoutes')
const allReports = require('./routes/allReportsRoutes')

//=========== app.use routes =============================
app.use("/matrials", matrialRoutes);
app.use("/finalProducts" , finalProductRoutes)
app.use( "/all-reports" , allReports )
app.use('/materialsReport', materialsReportRoutes )
