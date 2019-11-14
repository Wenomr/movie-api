const fruitBasket = {
    apple: 27, 
    grape: 0,
    pear: 14 
}


const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const getNumFruit = fruit => {
    return sleep(1000).then(v => fruitBasket[fruit])
}

getNumFruit('apple')
  .then(num => console.log(num)) // 27

/*
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
  
const getNumFruit = fruit => {
    return sleep(1000).then(v => fruitBasket[fruit])
}
  
getNumFruit('apple')
    .then(num => console.log(num)) // 27

    const control = async _ => {
        console.log('Start')
      
        const numApples = await getNumFruit('apple')
        console.log(numApples)
        
        const numGrapes = await getNumFruit('grape')
        console.log(numGrapes)
      
        const numPears = await getNumFruit('pear')
        console.log(numPears)
      
        console.log('End')
    }
*/