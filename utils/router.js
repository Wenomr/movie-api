require("dotenv").config();
const express = require("express");
const request = require('request');
const router = express.Router();
const genres = require('./genres');
const bd = require('./bd');
const md5 = require('md5');

const sort = ["popularity.desc", "release_date.desc", "vote_average.desc"]; // список доступных сортировок.
const api_line = `?api_key=${process.env.API_KEY}`;

bd.deleteGenres().then(async () => {
    await bd.saveGenres(genres);
    console.log("Genres ready.");
})

router.get("/movies/id/:id", (req, res) => {
    // Последние сохраненные в базе фильмы
    bd.getMovie(req.params.id).then((movie) => {
        if (movie) {
            res.send(movie);
        }  else {
            request(`https://api.themoviedb.org/3/movie/${req.params.id}${api_line}&language=en-US`, (error, response, body) => {
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

    bd.getResult(hash).then(async (result) => {
        if (!result) {
            let url = `https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US&vote_count.gte=1200${sort_line}${average_line}${genre_line}${year_line}`;
            request(url, async (error, response, body) => {
                
                let results = JSON.parse(body).results.slice(0, parseInt(count));
                let movie_id_list = [];
                for (movie of results) {
                    movie.genre_titles = genres.genresIdToTitles(movie.genre_ids);
                    movie_id_list.push(movie.id);
                    await bd.saveMovie(movie);
                }
                await bd.saveResult(hash, movie_id_list);
                // res.render("index", {
                //     results: results,
                //     genres: genres
                // });
                res.send(results);
            });
        } else {
            const ids = result.movies;
            await bd.getMovies(ids).then((movies) => {
                const movie_list = [];
                for (id of ids) {
                    for (movie of movies) {
                        if (movie.id == id) {
                            movie_list.push(movie);
                        }
                    }
                }
                // res.render("index", {
                //     results: movie_list,
                //     genres: genres
                // });
                res.send(movie_list);
            });
        }
    });
});

router.get("/movies/genre/:id", (req, res) => {
    
    let genre_id = req.params.id;
    let genre_line = `&with_genres=${genre_id}`;
    bd.getGenre(genre_id).then((genre) => {
        if (genre.ready !== true) {
            let percentage = genre.done/genre.total * 100;
            let status = `Loading ${genre.done} out of ${genre.total}. (${percentage.toFixed(2)/1}%). For now average = ${genre.average.toFixed(2)/1}`;
            res.send(status);
        } else {
            res.send(`Counting starts!`);
            request(`https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US${genre_line}`, (error, response, body) => {
                body = JSON.parse(body);
                let total = body.total_pages;
                for (let i = 1, p = Promise.resolve(); i <= total; i++) {
                    p = p.then(result => new Promise(resolve =>
                    setTimeout(
                        () => {
                            request(`https://api.themoviedb.org/3/discover/movie${api_line}&language=en-US${genre_line}&page=${i}`, (error, response, body) => {
                                body = JSON.parse(body);
                                let movie_sum = 0;
                                for (movie of body.results) {
                                    movie_sum += movie.vote_average;
                                }
                                //console.log(`${i} of ${body.total_pages} is done`);
                                let rating = movie_sum/body.results.length;
                                bd.updateGenre(genre_id, i, rating, total);
                            });
                            resolve();
                        }, 400)
                    ));
                }
            });
        }
    });
});

module.exports = router;