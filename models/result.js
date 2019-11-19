const mongoose = require('mongoose');

// movie list result Model

const resultSchema = new mongoose.Schema ({
    id : String,
    movies : [Number]
});
  
const Result = mongoose.model("Result", resultSchema);

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

exports.getResult = getResult;
exports.saveResult = saveResult;