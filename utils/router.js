require("dotenv").config();
const express = require("express");
const router = express.Router();
const request = require('request');
const genres = require('./genres');
const bd = require('./bd');
const movieModel = require('../models/movie');
const genreModel = require('../models/genre');
const resultModel = require('../models/result');
const md5 = require('md5');

const sort = ["popularity.desc", "release_date.desc", "vote_average.desc"]; // список доступных сортировок.
const api_line = `?api_key=${process.env.API_KEY}`;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

genreModel.deleteGenres().then(async () => {
    await genreModel.saveGenres(genres);
    console.log("Genres ready.");
})

router.get("/movies/id/:id", (req, res) => {
    // Последние сохраненные в базе фильмы
    movieModel.getMovie(req.params.id).then((movie) => {
        if (movie) {
            res.send(movie);
        }  else {
            let url = `https://api.themoviedb.org/3/movie/${req.params.id}${api_line}&language=en-US`;
            request(url, (error, response, body) => {
                if (error) {
                    res.send({error: "error"});
                } else if (body.status_code === 34) {
                    res.send(body);
                } else {
                    res.send({error: "not found"});
                }
            });
        }
    })
});

router.get("/movies/", (req, res) => {
    // Последние сохраненные в базе фильмы
    results = [];
    
    res.render("index", {
        results: results,
        genres: genres
    });
});

router.post("/movies/", (req, res) => {
    
    let {average, year, sortBy, genre_id, count} = req.body;
    sort.includes(sortBy) ? sortBy += "" : sortBy = "popularity.desc";
    let sort_line = `&sort_by=${sortBy}`;

    if (parseInt(count) > 20 || parseInt(count) < 1) { count = 8; }

    let genre_line = ``;
    if (genre_id) {
        for (genre of genres) {
            if (parseInt(genre_id) === genre.id) {
                genre_line = `&with_genres=${genre_id}`;
            }
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

    let hash = md5(average + year + sortBy + genre_id + count);

    resultModel.getResult(hash).then(async (result) => {
        if (!result) {
            let url = `https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US&vote_count.gte=1200${sort_line}${average_line}${genre_line}${year_line}`;
            request(url, async (error, response, body) => {
                
                let results = JSON.parse(body).results.slice(0, parseInt(count));
                let movie_id_list = [];
                for (movie of results) {
                    movie.genre_titles = genres.genresIdToTitles(movie.genre_ids);
                    movie_id_list.push(movie.id);
                    await movieModel.saveMovie(movie);
                }
                await resultModel.saveResult(hash, movie_id_list);
                res.send(results);
            });
        } else {
            const ids = result.movies;
            await movieModel.getMovies(ids).then((movies) => {
                const movie_list = [];
                for (id of ids) {
                    for (movie of movies) {
                        if (movie.id == id) {
                            movie_list.push(movie);
                        }
                    }
                }
                res.send(movie_list);
            });
        }
    });
});

router.get("/movies/genre/:id", (req, res) => {
    
    let genre_id = req.params.id;
    let genre_line = `&with_genres=${genre_id}`;
    genreModel.getGenre(genre_id).then((genre) => {
        if (genre.ready !== true) {
            let percentage = genre.done/genre.total * 100;
            let status = `Loading ${genre.done} out of ${genre.total}. (${percentage.toFixed(2)/1}%). For now average = ${genre.average.toFixed(2)/1}`;
            res.send(status);
        } else {
            res.send(`Counting starts!`);
            let url = `https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US${genre_line}`;
            request(url, async (error, response, body) => {
                body = JSON.parse(body);
                let total = body.total_pages;
                for (let i = 1; i < total; i ++) {
                    await delay(350).then(() => console.log(`counting ${i}`));
                    let url = `https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US${genre_line}&page=${i}`;
                    request(url, (error, response, body) => {
                        body = JSON.parse(body);
                        let movie_sum = 0;
                        for (movie of body.results) {
                            movie_sum += movie.vote_average;
                        }
                        let rating = movie_sum/body.results.length;
                        genreModel.updateGenre(genre_id, i, rating, total);
                    });
                }
            });
        }
    });
});

module.exports = router;