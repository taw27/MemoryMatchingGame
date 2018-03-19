const memoryGameGrid= document.querySelector(".memory-game-grid");
let gameCards= memoryGameGrid.children;
let timerObject={minutes:0,seconds:0};
let timerIntervalId;
let restart=false;
let timer= function(timerObject) {
    if(timerObject.seconds===59){
        timerObject.minutes++;
        timerObject.seconds=0;
    }
    timerObject.seconds++;

    document.querySelector(".timer").innerText=timerObject.minutes.toString()+" Minutes   "+ timerObject.seconds.toString()+" Seconds";
};

document.querySelector(".play-restart").addEventListener("click", gameStart);


function gameStart() {
    let counterObject={counter:0};
    let clickTrackerObject={card:undefined,clickNumber:0};
    const randomCardArray= randomiseCardOrder(gameCards);

    if(!restart){
        document.querySelector(".timer").innerText=" Game starting, get ready!!";
        document.querySelector(".play-restart").removeEventListener("click",gameStart);
        document.querySelector(".play").style.display="none";
        document.querySelector(".restart").style.display="initial";
        document.querySelector(".play-restart").addEventListener("click",gameRestart);
        document.querySelector(".popup-restart").addEventListener("click",gameRestart);
    }

    showCardsAtGameStart(memoryGameGrid, counterObject,clickTrackerObject);  
}

function addMoveHandler(element, counterObject, clickTrackerObject){
    console.log(counterObject.counter + " handeler")
    if(!restart){
        element.addEventListener("click", move);
    }

    function move(e) {
       
        let currentCard= e.target;

        if(restart){
            restart=false;
            counterObject.counter=0;
            clickTrackerObject={card:undefined,clickNumber:0}
        }
        
        if(currentCard===this){
            return;
        }
        else if(currentCard.parentNode.nodeName!=="UL"){
            while(currentCard.nodeName!=="LI"){
                currentCard=currentCard.parentNode;
            }
        }
        cardActions(clickTrackerObject,currentCard,counterObject);
        console.log(counterObject.counter+" in event")
        changeMoveCounter(counterObject);
    }
}

function changeMoveCounter(counterObject){
    counterObject.counter++;
    
    if(counterObject.counter%2===0){
        document.querySelector(".move-counter").textContent= (counterObject.counter/2).toString()+ " Moves";
        starChanger(counterObject.counter/2);
    }
}

function cardActions(clickTrackerObject,currentCard,counterObject){

    if(clickTrackerObject.clickNumber===0){
        actionFirstCardPick(currentCard, clickTrackerObject);
    }

    else if(clickTrackerObject.clickNumber===1){

        if(currentCard.classList.contains(clickTrackerObject.card.classList[0])&& currentCard!==clickTrackerObject.card){
            actionCardMatch(currentCard,clickTrackerObject,counterObject);
        } 
        else {
            actionCardMismatch(currentCard,clickTrackerObject);
        }
    }
}

function actionFirstCardPick(currentCard, clickTrackerObject){
    clickTrackerObject.card=currentCard;
    currentCard.classList.add("show-card");
    currentCard.style.pointerEvents="none";
    clickTrackerObject.clickNumber++; 
}

function actionCardMatch(currentCard, clickTrackerObject,counterObject){
    currentCard.classList.add("show-card");
    currentCard.classList.add("match-card");
    clickTrackerObject.card.classList.add("match-card");
   
    clickTrackerObject.clickNumber=0;
    currentCard.style.pointerEvents="none";
    clickTrackerObject.card.style.pointerEvents="none";

    if(document.querySelectorAll(".match-card").length===gameCards.length){
        gameEnd(counterObject);
    }
}

function actionCardMismatch(currentCard, clickTrackerObject){
    clickTrackerObject.card.classList.remove("show-card");
    clickTrackerObject.card.style.pointerEvents="auto";
    clickTrackerObject.clickNumber=0;
}

function gameEnd(counterObject){
    clearInterval(timerIntervalId);
    document.querySelector(".finish-popup").style.display="block";
    document.querySelector(".popup-move").textContent= Math.floor(counterObject.counter/2).toString();
    document.querySelector(".popup-time").textContent= timerObject.minutes.toString()+" Minutes   "
    + timerObject.seconds.toString()+" Seconds";
}

function gameRestart(){
    starReset();
    document.querySelector(".finish-popup").style.display="none"
    clearInterval(timerIntervalId);
    timerObject={minutes:0, seconds:0};
    document.querySelector(".timer").innerText=" Game restarting, get ready!!";
    document.querySelector(".move-counter").textContent= "0 Moves";


    for(let i=0;i<gameCards.length;i++){
        gameCards[i].style.pointerEvents="auto";
        gameCards[i].classList.remove("show-card");
        gameCards[i].classList.remove("match-card");
    }
    restart=true;
    gameStart();
}

function randomiseCardOrder(cardNodeList) {
    let randomArrayList= createRandomArrayList(cardNodeList);

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

function startTimer(){
    timerObject={minutes:0,seconds:0};
    timerIntervalId=setInterval(timer, 1000,timerObject);
}

function showCardsAtGameStart(memoryGameGrid, counterObject,clickTrackerObject){
    setTimeout(function(){
        for(let i=0; i<gameCards.length;i++){
            gameCards[i].classList.add("show-card");
        }
        setTimeout(hideCardsAtGameStart,3000,memoryGameGrid, counterObject,clickTrackerObject)
    },1000);
} 

function hideCardsAtGameStart(memoryGameGrid, counterObject,clickTrackerObject) {
    for(let i=0; i<gameCards.length;i++){
        gameCards[i].classList.remove("show-card");
    }
    startTimer();
    addMoveHandler(memoryGameGrid, counterObject,clickTrackerObject);
}

function starChanger(moveCount){
    if(moveCount===10){
        document.querySelector(".star3").classList.add("star-hide");
    }

    else if( moveCount===15){
        document.querySelector(".star2").classList.add("star-hide")
    }

    else if(moveCount===19) {
        document.querySelector(".star1").classList.add("star-hide")
    }
}

function starReset(){
    document.querySelector(".star1").classList.remove("star-hide");
    document.querySelector(".star2").classList.remove("star-hide");
    document.querySelector(".star3").classList.remove("star-hide");
}

