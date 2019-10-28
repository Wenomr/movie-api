const mongoose = require('mongoose');

const uri = "mongodb+srv://vova:"+ process.env.BD_PASS +"@bloglvluptest-iyvhk.mongodb.net/movie_base?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected...'))
  .catch(err => console.log(err));

mongoose.set("useCreateIndex", true);

const movieSchema = new mongoose.Schema ({
  id : Number,
  title: String,
  popularity: Number,
  vote_average: Number,
  release_date: String,
  genre_ids: [Number],
  overview: String,
  poster_path: String
});

const Movie = mongoose.model("Movie", movieSchema);

const getMovies = () => {
    return Movie.find({}).exec();
};

const saveMovie = (movie) => {
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
};

const deleteMovies = () => {
    return Movie.deleteMany({}).exec(); 
};

exports.saveMovie = saveMovie;
exports.getMovies = getMovies;
exports.deleteMovies = deleteMovies;
