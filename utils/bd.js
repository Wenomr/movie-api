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
    total : Number,
    average : Number,
    summ: Number
});
  
const Genre = mongoose.model("Genre", genreSchema);

const getGenre = (id) => {
    return Genre.findOne({id: id}).exec();
};

const saveGenres = (genres) => {
    for (genre of genres) {
        const newGenre = new Genre ({
            id : genre.id,
            ready : true,
            done : 0,
            average : 5,
            total : 500,
            summ: 0
        });
        newGenre.save();
    }
    return;
};

const deleteGenres = () => {
    return Genre.deleteMany({}).exec();
}

const updateGenre = (id, i, rating, total) => {
    if (i === total) {
        ready = true;
    }
    else {
        ready = false;
    }

    Genre.findOne({id: id}).then((genre) => {
        console.log(genre);
        let summ = genre.summ;
        let new_summ = (rating + summ);
        let new_average = (new_summ/i);

        if (i === 1) {
            new_summ = rating;
            new_average = rating;
        }

        Genre.updateOne({ id: id }, {
            done : i, 
            average: new_average, 
            total : total,
            ready : ready,
            summ : new_summ
        }, (err, res) => {
            if (err) {
                console.log(err);
            }
        });
    });
};

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
exports.getGenre = getGenre;
exports.saveGenres = saveGenres;
exports.deleteGenres = deleteGenres;
exports.updateGenre = updateGenre;