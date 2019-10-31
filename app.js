require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const router = require("./utils/router");
const ejs = require("ejs");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type:application/json; charset=UTF-8, Accept");
    next();
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/", router);

app.listen(PORT, () => {
    console.log("Server for a blog started on port ", PORT);
});

