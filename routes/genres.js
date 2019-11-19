
const express = require("express");
const axios = require('axios');
const router = express.Router();
const genreModel = require('../models/Genre');

const api_line = `?api_key=${process.env.API_KEY}`;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// @route   GET api/genre/:id
// @desc    Counting of genre avarage rating
// @access  Public

router.get('/:id', async (req, res) => {

    let genre_id = req.params.id;
    let genre_line = `&with_genres=${genre_id}`;

    const genre = await genreModel.getGenre(genre_id);

    if (genre.ready !== true) {
        let percentage = genre.done/genre.total * 100;
        let status = `Loading ${genre.done} out of ${genre.total}. (${percentage.toFixed(2)/1}%). For now average = ${genre.average.toFixed(2)/1}`;
        res.send(status);
    } else {
        res.send(`Counting starts!`);
        let url = `https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US${genre_line}`;
        let request = await axios.get(url);
        data = request.data;
        let total = data.total_pages;
        // итератор с async/await
        for (let i = 1; i < total; i ++) {
            await delay(350);
            //console.log(`counting ${i}`);
            let url = `https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US${genre_line}&page=${i}`;
            let request = await axios.get(url);
            let data = request.data;
            let movie_sum = 0;
            data.results.forEach((movie) => {
                movie_sum += movie.vote_average;
            });
            let rating = movie_sum/data.results.length;
            genreModel.updateGenre(genre_id, i, rating, total);
        }
    }   
});

module.exports = router;