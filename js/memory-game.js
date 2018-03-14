const memoryGameGrid= document.querySelector(".memory-game-grid");
let gameCards= memoryGameGrid.children;

console.log(gameCards.length);

randomiseCardOrder(gameCards);

function randomiseCardOrder(nodeList) {
    let randomArrayList= createRandomArrayList(nodeList);

    for(let i=0; i<randomArrayList.length;i++){
        console.log(randomArrayList[i]);
        randomArrayList[i].style.order= i.toString();;
    }
}

// help taken from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function createRandomArrayList(nodeList){
   let arrayList= Array.from(nodeList)
   let randomIndex;
   let current;

   for(let i=0; i<gameCards.length;i++){
       current= arrayList[i];
       randomIndex=randomIntGnerator(gameCards.length-1, i);
       arrayList[i]=arrayList[randomIndex];
       arrayList[randomIndex]= current;
   }

   return arrayList;
}

function randomIntGnerator(upperLimit, lowerLimit){
    return (Math.floor((Math.random())*(upperLimit-lowerLimit+1))+lowerLimit);
}