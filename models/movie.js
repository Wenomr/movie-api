const mongoose = require('mongoose');

// movie Model

const movieSchema = new mongoose.Schema ({
    id : Number,
    title: String,
    popularity: Number,
    vote_average: Number,
    release_date: String,
    genre_ids: [Number],
    genre_titles: [String],
    overview: String,
    poster_path: String
});

const Movie = mongoose.model("Movie", movieSchema);

const getMovies = (ids) => {
    return Movie.find({id : ids}).exec();
};

const getMovie = (id) => {
    return Movie.findOne({id : id}).exec();
};

const saveMovie = (movie) => {
    getMovie(movie.id).then((result) => {
        if (!result) {
            const newMovie = new Movie ({
                id : movie.id,
                title: movie.title,
                popularity: movie.popularity,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                genre_ids: movie.genre_ids,
                genre_titles: movie.genre_titles,
                overview: movie.overview,
                poster_path: movie.poster_path
            });
            return newMovie.save();
        }
    });
};

const deleteMovies = () => {
    return Movie.deleteMany({}).exec(); 
};

exports.saveMovie = saveMovie;
exports.getMovies = getMovies;
exports.getMovie = getMovie;
exports.deleteMovies = deleteMovies;