const mongoose = require('mongoose');

const uri = "mongodb+srv://vova:"+ process.env.BD_PASS +"@bloglvluptest-iyvhk.mongodb.net/movie_base?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected...'))
  .catch(err => console.log(err));

mongoose.set("useCreateIndex", true);

const movieSchema = new mongoose.Schema ({
    id : {
        type: Number,
        index: {unique: true, dropDups: true}
    },
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

const resultSchema = new mongoose.Schema ({
    id : String,
    movies : [Number]
});
  
const Result = mongoose.model("Result", resultSchema);

const genreSchema = new mongoose.Schema ({
    id : Number,
    ready : Boolean,
    done : Number,
    total : Number
});
  
const Genre = mongoose.model("Genre", genreSchema);

const getResult = (id) => {
    return Result.findOne({id: id}).exec();
};

const saveResult = (id, movie_ids) => {
    const newResult = new Result ({
        id : id,
        movies : movie_ids
    });
    return newResult.save();
};

const getMovies = (ids) => {
    return Movie.find({id : ids}).exec();
};

const getMovie = (id) => {
    return Movie.findOne({id : id}).exec();
};

const saveMovie = (movie) => {
    getMovie(movie.id).then((result) => {
        console.log(result);
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
exports.getResult = getResult;
exports.saveResult = saveResult;
