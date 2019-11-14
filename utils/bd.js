const mongoose = require('mongoose');

const uri = "mongodb+srv://vova:"+ process.env.BD_PASS +"@bloglvluptest-iyvhk.mongodb.net/movie_base?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected...'))
  .catch(err => console.log(err));

mongoose.set("useCreateIndex", true);