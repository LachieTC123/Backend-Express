require("dotenv").config();
let bodyParser = require("body-parser");
let express = require("express");
let app = express();
let path = __dirname + "/public";

//Higher calls take precidence i.e. lower duplicate methods wont get seen (app.get for example)

//middleware to handle URL encoded data
app.use("/", bodyParser.urlencoded({ extended: false }));

//Chained get and post overrides as to allow different processing for each
app
  .route("/name")
  .get(function (req, res) {
    res.json({ name: req.query.first + " " + req.query.last });
  })
  .post(function (req, res) {
    console.log(req.body);
    res.json({ name: req.body.first + " " + req.body.last });
  });

//Handles a route parameter request for the string :Word (params.var is how you access)
app.get("/:word/echo", function (req, res) {
  res.json({ echo: req.params.word });
});

//Handles middleware chaining on get calls to /now path
app.get(
  "/now",
  function (req, res, next) {
    req.time = new Date().toString();
    next();
  },
  function (req, res) {
    res.json({ time: req.time });
  }
);

//Handles all calls to root (/)
app.use("/", function (req, res, next) {
  //Calls Middleware
  logger(req, res);

  //REQUIRED: Carrys out any following methods
  next();
});

//Handles all calls to /public path
app.use("/public", express.static(path));

//Handles get calls to the root (/) path
app.get("/", function (req, res) {
  let path = __dirname + "/views/index.html";
  res.sendFile(path);
});

//Handles GET calls to the /json path
app.get("/json", function (req, res) {
  let msgString = "Hello json";

  //Accessing private env files
  if (process.env.MESSAGE_STYLE == "uppercase") {
    msgString = msgString.toUpperCase();
  }
  res.json({ message: msgString });
});
console.log("Hello World");

module.exports = app;

function logger(req, res) {
  console.log(req.method + " " + req.path + " - " + req.ip);
}
