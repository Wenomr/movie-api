require("dotenv").config();
const express = require("express");
const request = require('request');
const router = express.Router();
const genres = require('./genres');
const bd = require('./bd');

const sort = ["popularity.desc", "release_date.desc", "vote_average.desc"]; // список доступных сортировок.
const api_line = `?api_key=${process.env.API_KEY}`;

router.get("/movies/id/:id", (req, res) => {
    // Последние сохраненные в базе фильмы
    console.log(req.params.id);
    
    request(`https://api.themoviedb.org/3/movie/${req.params.id}${api_line}&language=en-US`, (error, response, body) => {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // let results = JSON.parse(body).results.slice(0, parseInt(count));
            res.send(`<h3><a href = "/movies/">HOME</a></h3><p>${body}</p>`);
        });
});

router.get("/movies/", (req, res) => {
    // Последние сохраненные в базе фильмы
    bd.getMovies().then((results) => {
        if (!results) {
            results = {}
        }
        console.log(results);
        res.render("index", {
            results: results,
            genres: genres
        });
    });

});

router.post("/movies/", (req, res) => {

    let {average, year, sortBy, genre_id, count} = req.body;
    console.log("Average: ", average, "Year: ", year, "Sort: ", sortBy, "Genre_ID: ", genre_id);
    sort.includes(sortBy) ? sortBy += "" : sortBy = "popularity.desc";
    let sort_line = `&sort_by=${sortBy}`;

    console.log("GENRE_ID:", genre_id, "GENRE_NAME: ", genres.genresIdToTitle(genre_id));

    let genre_line = ``;;
    for (genre of genres) {
        if (parseInt(genre_id) === genre.id) {
            genre_line = `&with_genres=${genre_id}`;
        }
    }

    let average_line;
    if (parseInt(average) < 10 && parseInt(average) > 1 ) {
        average = parseInt(average);
        average_line = `&vote_average.gte=${average}`;
    } else {
        average = false;
        average_line = ``;
    }

    let year_line;
    if (parseInt(year) < 2020 && parseInt(year) > 1922) {
        year = parseInt(year);
        year_line = `&primary_release_year=${year}`;
    } else {
        year = false;
        year_line = ``;
    }
    
    bd.deleteMovies().then(() => {
        request(`https://api.themoviedb.org/3/discover/movie${api_line}&language=en-U${sort_line}${average_line}${genre_line}${year_line}`, (error, response, body) => {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            let results = JSON.parse(body).results.slice(0, parseInt(count));
            for (movie of results) {
                movie.genre_titles = genres.genresIdToTitles(movie.genre_ids);
                bd.saveMovie(movie);
                console.log("________________");
                console.log(movie.vote_count, movie.popularity, movie.vote_average);
            }
            //res.send("API is working properly");
            res.render("index", {
                results: results,
                genres: genres
            });
        });
    });

});

let isBusy = false;
let amount_done;
let amount_full;

router.get("/movies/genreprogress", (req, res) => {
    if (isBusy) {
        console.log(amount_done, amount_full);
    }
    let genre_id = 35;
    let genre_line = `&with_genres=${genre_id}`;

    class Counter {
        constructor(done) {
            this.done = done
        }
        // Adding a method to the constructor
        count() {
            this.done++;
            console.log(counterLittle.done);
        }
    }
    const counterLittle = new Counter(0);
    counterLittle.count();

    res.send("S");

    request(`https://api.themoviedb.org/3/discover/movie${api_line}&language=en-U${genre_line}`, (error, response, body) => {
        counterLittle.done = 0;
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        body = JSON.parse(body);
        console.log(body.results.length);

        amount_full = body.results.length;
        amount_done = 0;
        for (movie in body.results) {
            setTimeout(counterLittle.count, 1000, movie);
            
        }
    });
   
});

module.exports = router;