const memoryGameGrid= document.querySelector(".memory-game-grid");
let gameCards= memoryGameGrid.children;

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
    addMoveHandler(memoryGameGrid, counterObject,clickTrackerObject);  
}

function addMoveHandler(element, counterObject, clickTrackerObject){
    element.addEventListener("click", move,false);

    function move(e) {
       
        let currentCard= e.target;
        
        if(currentCard===this){
            return;
        }

        else if(currentCard.parentNode.nodeName!=="UL"){
            
            while(currentCard.nodeName!=="LI"){
                currentCard=currentCard.parentNode;
            }
            
        }
        cardActions(clickTrackerObject,currentCard);
        changeMoveCounter(counterObject);
    }
}

function changeMoveCounter(counterObject){
    counterObject.counter++;
    
    if(counterObject.counter%2===0){
        document.querySelector(".move-counter").textContent= (counterObject.counter/2).toString()+ " Moves";
    }
}

function cardActions(clickTrackerObject,currentCard){

    if(clickTrackerObject.clickNumber===0){
        clickTrackerObject.card=currentCard;
        currentCard.classList.add("show-card");
        clickTrackerObject.clickNumber++;   
    }

    else if(clickTrackerObject.clickNumber===1){

        if(currentCard.classList.contains(clickTrackerObject.card.classList[0])){
            currentCard.classList.add("show-card");
            clickTrackerObject.clickNumber=0;
            currentCard.style.pointerEvents="none";
            clickTrackerObject.card.style.pointerEvents="none";
        } 
        else {
            clickTrackerObject.card.classList.remove("show-card");
            clickTrackerObject.clickNumber=0;
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