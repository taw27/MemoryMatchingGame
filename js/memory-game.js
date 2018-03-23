//Author: Tawshif Tamjid Alam//

//Global variables that can be accesed by any function
const memoryGameGrid= document.querySelector(".memory-game-grid"); // The whole Game Grid
let gameCards= memoryGameGrid.children; //The individual cards
let timerObject={minutes:0,seconds:0}; // the timer object that stores gthe seconds and minutes
let timerIntervalId; // wholes thenid of the timer intervals
let restart=false; // stores true if game has been retarted and false if not

// Take in the timerObject, increments the seconds and minutes and displays the time elapsed
let timer= function(timerObject) {
    if(timerObject.seconds===59){
        timerObject.minutes++;
        timerObject.seconds=0;
    }
    timerObject.seconds++;

    document.querySelector(".timer").innerText=timerObject.minutes.toString()+" Minutes   "+ timerObject.seconds.toString()+" Seconds";
};

document.querySelector(".play-restart").addEventListener("click", gameStart); //starts the game when the play button is pressed

/*
** Starts the game. Sets the counter and the card tracker to 0, randomises the card order, if the game has not be restarted
** then adds a game start message, changes the play button to a restart button, ads listener to the restart button and adds listener to the
** the popup restart button. At the end calls a function to show the randomised cards
*/
function gameStart() {
    let counterObject={counter:0}; //Stores the move counter
    let clickTrackerObject={card:undefined,clickNumber:0}; //Stores the previous card clicked and hte clcikNumber per move cycle
    randomiseCardOrder(gameCards);

    if(!restart){
        document.querySelector(".timer").innerText=" Game starting, get ready!!";
        document.querySelector(".play-restart").addEventListener("click",gameRestart);
        document.querySelector(".popup-restart").addEventListener("click",gameRestart);
        document.querySelector(".play-restart").removeEventListener("click",gameStart);
        document.querySelector(".play").style.display="none";
        document.querySelector(".restart").style.display="initial";
    }

    showCardsAtGameStart(memoryGameGrid, counterObject,clickTrackerObject);
}

/*
** Function is a wrapper for the listener function. Takes in the game grid as an element, counterObject and clickTrackerObject. Adds
** listener to the grid if the game has not been restarted previously as the listener will have already been atrtached in that case.
**
*/
function addMoveHandler(element, counterObject, clickTrackerObject){
    if(!restart){
        element.addEventListener("click", move);
    }

    /*
    ** Takes the cuurent click target as a parameter. If restart is true then resets the clickTRackerObject and the move counter
    ** , checks if the cuurent card is the whole grid and non individual cards and if true the does nothing and returns, if false
    ** checks if the current target is the cards children and if true then makes the target the parent(card), and in the end calls
    ** the function that deals with the card logic and another function that deals with the moves
    */
    function move(e) {

        let currentCard= e.target;

        if(restart){
            restart=false;
            counterObject.counter=0;
            clickTrackerObject={card:undefined,clickNumber:0};
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
        changeMoveCounter(counterObject);
    }
}

// Takes in the counterObject as a parameter, increments the count and displays the move number in the game
function changeMoveCounter(counterObject){
    counterObject.counter++;

    if(counterObject.counter%2===0){
        document.querySelector(".move-counter").textContent= (counterObject.counter/2).toString()+ " Moves";
        starChanger(counterObject.counter/2);
    }
}

/*
** FUnction to handle the logice of card matching. Takes in the clickTrackerObject that stores the previous card and the click
** number per move cycle, the currentCard and the counterObject that keeps track of the Move. If its the irst pick of the cycle
** invokes the function to deal withh it, if it's the second clicke of the move cycle the checks if the current card and the previous
** card match and calls the function to deal with the match and if not then calls the function to deal with a mismatch
*/
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

/*
** Function that is invoked when the first card of a move cycle is picked. Takes in the current card and clickTrackerObject
** , adds the show-class class to the card to reveal it in the game grid, and then stores the card in the clickTrackerobject
** and chages the click number in the clickTrackerObject to 1 to indicate the first card of the move cycle has been picked
*/
function actionFirstCardPick(currentCard, clickTrackerObject){
    clickTrackerObject.card=currentCard;
    currentCard.classList.add("show-card");
    currentCard.style.pointerEvents="none";
    clickTrackerObject.clickNumber++;
}

/*
** Function that is called whent the user succesfully matches a card paid. Takes in the current card and the clickTrackerObject
** that contains the previous clciked card and the clicknumber per move, adds the show-card class tot the current and previous
** card to display them in the game and sets their pointer event to none so they can't be clicked anymorr, and sets the clicknumber
** per move to 0 to indicate that a complete move cycle has completed. At the end checks if all 8 pair of cards have been matched
** and if so calls the gameEnd function which handles the ending logic
*/
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

/*
** Function to be called when the user picks the wrong card for the second click. Takes in the currentCard
** and the clickTracker object as parameters, hides the current card and the previous card stored in the
** clickTrackerobject, resets the pointer events so that they are clickable again and resets the clickNumber
** that tracks the click number for each move to 0
*/
function actionCardMismatch(currentCard, clickTrackerObject){
    clickTrackerObject.card.classList.remove("show-card");
    clickTrackerObject.card.style.pointerEvents="auto";
    clickTrackerObject.clickNumber=0;
}

// Displays the end game modal and along with the number of moves and time that was taken to finish the game
function gameEnd(counterObject){
    clearInterval(timerIntervalId);

    document.querySelector(".finish-popup").style.display="block";
    if(counterObject.counter%2===0){
        document.querySelector(".popup-move").textContent= (counterObject.counter/2).toString();
        starChanger(counterObject.counter/2);
    }
    else{
        document.querySelector(".popup-move").textContent= ((counterObject.counter+1)/2).toString();
    }
    document.querySelector(".popup-time").textContent= timerObject.minutes.toString()+" Minutes   " + timerObject.seconds.toString()+" Seconds";
}

/*
** Restarts th game by reseting the star rating, clearing the timer, removing the ending modal,
** , looping over all the cards, setting reset global variable to true, and setting it to inital
** condition and calling the gameStart function
*/
function gameRestart(){
    starReset();
    clearInterval(timerIntervalId);

    timerObject={minutes:0, seconds:0};

    document.querySelector(".finish-popup").style.display="none";
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

/*
** Takes nodeList of all the card elements and uses the createRandomArrayList function to get a shuffled
** arrayList of the card elements using it. Sets the order for the card elemnts according to their index
** in the shuffled arrayList so that a random order of cards are displayed.
** Returns the shuffled arrayList of card elements
*/
function randomiseCardOrder(cardNodeList) {
    let randomArrayList= createRandomArrayList(cardNodeList);

    for(let i=0; i<randomArrayList.length;i++){
        randomArrayList[i].style.order= i.toString();
    }

    return randomArrayList;
}

/*
** Help taken from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
** Takes a nodeList as parameter and creates and arrayList from it. Uses a for loop and the
** randomIntGenerator function to shuffle the index of the contntents. Returns the shuffled arrayList
*/
function createRandomArrayList(nodeList){
   let arrayList= Array.from(nodeList);
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

//Takes an upperlimit and lower limit as parameters and returns a random integer in that range
function randomIntGnerator(upperLimit, lowerLimit){
    return (Math.floor((Math.random())*(upperLimit-lowerLimit+1))+lowerLimit);
}

// Sets the minutes and seconds in the timer object to 0 and starts the timer
function startTimer(){
    timerObject={minutes:0,seconds:0};
    timerIntervalId=setInterval(timer, 1000,timerObject); //stores the interval id
}

/*
** calls an inline function after 1 seconds that loops over the game cards and adds the show-cards class
** to reveal the game cards then calls the function hoe hide the cards after 3 seconds
*/
function showCardsAtGameStart(memoryGameGrid, counterObject,clickTrackerObject){
    setTimeout(function(){
        for(let i=0; i<gameCards.length;i++){
            gameCards[i].classList.add("show-card");
        }
        setTimeout(hideCardsAtGameStart,3000,memoryGameGrid, counterObject,clickTrackerObject);
    },1000);
}

/*
** loops over the game cards node list and removes the show-card class to hide the cards, starts the game
** timer and then activates the card logic by calling the addMoveHandler function
*/
function hideCardsAtGameStart(memoryGameGrid, counterObject,clickTrackerObject) {
    for(let i=0; i<gameCards.length;i++){
        gameCards[i].classList.remove("show-card");
    }
    startTimer();
    addMoveHandler(memoryGameGrid, counterObject,clickTrackerObject);
}

/*
** Takes the move count as a parameter and changes the number of star rating to be displayed by adding the star-hide class depending on
** the move count
*/
function starChanger(moveCount){
    if(moveCount===12){
        document.querySelector(".star3").classList.add("star-hide");
        document.querySelector(".star6").classList.add("star-hide");
    }

    else if( moveCount===18){
        document.querySelector(".star2").classList.add("star-hide");
        document.querySelector(".star5").classList.add("star-hide");
    }
}

// makes all the star rating visible by removing the star-hide class from the individual stars
function starReset(){
    document.querySelector(".star3").classList.remove("star-hide");
    document.querySelector(".star2").classList.remove("star-hide");
    document.querySelector(".star6").classList.remove("star-hide");
    document.querySelector(".star5").classList.remove("star-hide");
}

