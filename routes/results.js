const express = require("express");
const router = express.Router();
const axios = require('axios');
const resultModel = require('../models/Result');
const movieModel = require('../models/Movie');
const genres = require('../utils/genres');
const md5 = require('md5');
const sort = ["popularity.desc", "release_date.desc", "vote_average.desc"]; // список доступных сортировок.

const api_line = `?api_key=${process.env.API_KEY}`;

// @route   GET api/movies
// @desc    Get form for requesting movies
// @access  Public

router.get("/", (req, res) => {
    results = [];
    res.render("index", {
        results: results,
        genres: genres
    });
});

// @route   POST api/contacts
// @desc    Get result list of movies by settings
// @access  Public

router.post("/", async (req, res) => {

    let {average, year, sortBy, genre_id, count} = req.body;
    sort.includes(sortBy) ? sortBy += "" : sortBy = "popularity.desc";
    let sort_line = `&sort_by=${sortBy}`;

    if (parseInt(count) > 20 || parseInt(count) < 1) { count = 8; }

    let genre_line = ``;
    if (genre_id) {
        genres.forEach((genre) => {
            if (parseInt(genre_id) === genre.id) {
                genre_line = `&with_genres=${genre_id}`;
            }
        });
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

    const result = await resultModel.getResult(hash);

    if (!result) {
        let url = `https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US&vote_count.gte=1000${sort_line}${average_line}${genre_line}${year_line}`;
        let data = await axios.get(url);
        data = data.data.results.slice(0, parseInt(count));

        let movie_id_list = [];
        data.forEach((movie) => {
            movie.genre_titles = genres.genresIdToTitles(movie.genre_ids);
            movie_id_list.push(movie.id);
            movieModel.saveMovie(movie);
        });
        await resultModel.saveResult(hash, movie_id_list);
        res.send(data);

    } else {
        const ids = result.movies;
        const movies = await movieModel.getMovies(ids);
        const movie_list = [];
        ids.forEach((id) => {
            movies.forEach((movie) => {
                if (movie.id == id) {
                    movie_list.push(movie);
                }
            });
        });
        res.send(movie_list);
    }
});

module.exports = router;