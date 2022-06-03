const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const Routs = require("./routs");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    info: {
      title: "test blog API",
      description: "API information",
      contacts: {
        name: "Viktor Naumov",
      },
      servers: ["http://localhost:3001"],
    },
  },
  apis: ["routs.js"],
};
var options = {
    explorer: true
  };
const swaggerDocs = swaggerJsDoc(swaggerOptions);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs,options));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.set("trust proxy", 1); // trust first proxy
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("uploads"));
app.use(morgan("dev"));






app.use("/api", Routs);

module.exports = app;
