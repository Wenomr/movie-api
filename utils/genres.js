const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
];

const genresIdToTitle = (genre_id) => {
    for (item of genres) {
        if (item.id === parseInt(genre_id)) {
            return item.name;
        }
    }
  return item.name;
} 

const genresIdToTitles = (genre_ids) => {
  let genre_titles = genre_ids.map((el) => {
      for (item of genres) {
          if (item.id === parseInt(el)) {
              return item.name;
          }
      }
  });
  return genre_titles;
}

const getGenreTitleId = (genre_name) => {
  let genre_id;
  genres.forEach((el) => {
      if (genre_name === el.name) { genre_id = el.id }
  });
  return genre_id;
}

// router.get("/update_genre_base", (req, res) => {
//     request(`https://api.themoviedb.org/3/movie/${sortBy}?api_key=${process.env.API_KEY}&language=en-US`, (error, response, body) => {
//         console.log('error:', error); // Print the error if one occurred
//         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//         let results = JSON.parse(body).results.slice(0, 5);
//         console.log('body:', results);

//         res.send("API is working properly");
//     });
// });


module.exports = genres;
module.exports.getGenreTitleId = getGenreTitleId;
module.exports.genresIdToTitle = genresIdToTitle;
module.exports.genresIdToTitles = genresIdToTitles;