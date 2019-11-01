require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const router = require("./utils/router");
const cors = require('cors');
const ejs = require("ejs");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/", router);

app.listen(PORT, () => {
    console.log("Server for a blog started on port ", PORT);
});

