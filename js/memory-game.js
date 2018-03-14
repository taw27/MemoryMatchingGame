const memoryGameGrid= document.querySelector(".memory-game-grid");
let gameCards= memoryGameGrid.children;

console.log(gameCards.length);

gameStart();

function gameStart() {
    let counterObject=
    {
        counter:0
    };
    let clickTrackerObject=
    {
        card:undefined,
        clickNumber:0
    };
    const randomCardArray= randomiseCardOrder(gameCards);
    console.log(memoryGameGrid);

    addClickHandler(memoryGameGrid, counterObject,clickTrackerObject);  
}

function addClickHandler(element, counterObject, clickTrackerObject){
    console.log(element);
    element.addEventListener("click", move,false);

    function move(e) {
        let currentCard= e.target;

        if(currentCard===this){
            return;
        }

        else if(currentCard.parentNode!==this){
            currentCard=currentCard.parentNode;
        }
        console.log(currentCard);
    
        counterObject.counter++;
    
        if(clickTrackerObject.clickNumber===0){
            clickTrackerObject.card=currentCard;
            currentCard.classList.add("show-card")   
        }
        else if(clickTrackerObject.clickNumber===1){
            //TODO change === to == if doesnt work
            if(clickTrackerObject.card.classList[0]=currentCard.classList[0]){
                currentCard.classList.add("show-card")
                // TODO remove event listeners from target
                clickTrackerObject.clickNumber=0;
            } 
            else {
                clickTrackerObject.card.classList.remove("show-card");
                currentCard.classList.remove("show-card");
                clickTrackerObject.clickNumber=0;
            }
        }
    
        if(counterObject.counter%2===0){
            document.querySelector(".move-counter").TextContent= (counterObject/2).toString();
        }
    }
}



function randomiseCardOrder(nodeList) {
    let randomArrayList= createRandomArrayList(nodeList);

    for(let i=0; i<randomArrayList.length;i++){
        randomArrayList[i].style.order= i.toString();;
    }

    return randomArrayList;
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