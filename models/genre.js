const mongoose = require('mongoose');

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

exports.getGenre = getGenre;
exports.saveGenres = saveGenres;
exports.deleteGenres = deleteGenres;
exports.updateGenre = updateGenre;