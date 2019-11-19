require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require('cors');
const connectDB = require('./config/bd');
const genres = require('./utils/genres');

const PORT = process.env.PORT || 5000;
const app = express();

// Connect DB
connectDB();
genres.genresReset();

// Init middleware
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static("public"));

// use Routes

app.use('/api/movies', require("./routes/results"));
app.use('/api/movie', require("./routes/movies"));
app.use('/api/genre', require("./routes/genres"));

app.listen(PORT, () => {
    console.log("Server for a blog started on port ", PORT);
});

