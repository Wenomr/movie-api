    
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//delay(3000).then(()=> console.log("3 seconds"));

const loop = async () => {
    const count = [1,2,3,4,5];
    for (let i = 0; i < 10; i ++) {
        await delay(1000).then(() => console.log(`counting ${i}`));
    }   
}

loop();

// res.render("index", {
//     results: movie_list,
//     genres: genres
// });