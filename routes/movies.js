const express = require("express");
const router = express.Router();
const axios = require('axios');
const movieModel = require('../models/Movie');

const api_line = `?api_key=${process.env.API_KEY}`;

// @route   GET api/contacts
// @desc    Get all user's contacts
// @access  Private

router.get('/:id', async (req, res) => {
    const movie = await movieModel.getMovie(req.params.id);
    if (movie) {
        res.send(movie);
    }  else {
        let url = `https://api.themoviedb.org/3/movie/${req.params.id}${api_line}&language=en-US`;
        const request = await axios.get(url);
        let data = request.data;
        res.send(data);
    }
});

module.exports = router;