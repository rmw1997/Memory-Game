/*
 * Create a list that holds all of your cards
 */
const cardlist=["fa-diamond","fa-diamond",
                "fa-paper-plane-o","fa-paper-plane-o",
                "fa-anchor","fa-anchor",
                "fa-bolt","fa-bolt",
                "fa-cube","fa-cube",
                "fa-leaf","fa-leaf",
                "fa-bicycle","fa-bicycle",
                "fa-bomb","fa-bomb"];

/*
 * Declaration of the variables
 */
let card1,card2; //card1 = first clicked card, card2 = second clicked card
let lock=false; //lock on clicking more than two cards 
let OpenCards=[]; //to insert the opened cards
let matchedCards=[]; //to insert the matched cards
let firstClick=false; //to check if the user click the cards for first time
let movesNo=0; // to count the number of moves
let sec = 120; //intialize the second to 120
let starNo = 3; //intialize the number of stars to 3

let timer=document.getElementById("time"); //to show the time
let counter=document.getElementById("moves"); //to show the number of moves
let restarticon = document.querySelector('.fa-repeat');  //restart icon
const deck=document.querySelector('.deck'); //to insert the shuffle card in this variable


/* TO SHUFFLE THE CARDS
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function shuffleCards(){
    const randomcards=shuffle(cardlist);
    for(rcard of randomcards){
        const listElement = document.createElement("li");
        listElement.classList.add("card");
        const icon=document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add(rcard);
        listElement.appendChild(icon);
        deck.appendChild(listElement);
    }

}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* GAME LOGIC
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
 * Declaration of the functions
 */


//function to perform action when the card is clicked
function OpenedCard(){
    //for each click, increament the move counter
    moveCounter();

    //to prevent the clicking of more than 2 cards 
    if(lock) return;
    //if it's a first click
    if(!firstClick){
        card1=this;
        card1.classList.add('open','show','disable');
        OpenCards.push(card1);
        firstClick=true;
    }
    //if it's a second click
    else{
        card1.classList.remove('disable');
        card2=this;
        card2.classList.add('open','show');
        OpenCards.push(card2);
        firstClick=false;
        checkMatching();
    }

}


//function to check the matched open cards
function checkMatching(){
    //if they match
    if(card1.innerHTML === card2.innerHTML){
            card1.classList.add('match');
            card2.classList.add('match');
            matchedCards.push(card1);
            matchedCards.push(card2);
            completeGame();  
    }
    //if they don't match
    else{
        lock=true;
        setTimeout(function(){
            OpenCards.forEach(function(card){
                card.classList.remove('open','show'); 
            });
        },1000);
        lock=false;
    }
    
}

//function for showing message when the user complete the game
function completeGame(){
    if(matchedCards.length===16){
        setTimeout(function(){
            let remainingSec=120-sec;
            let msg = confirm("Congratulations!\nYou finished with:\n"+ remainingSec +
                    " seconds\n"+ movesNo +" moves\n"+ starNo +
                    " stars\nDo you want to play again?");
            timer.remove;
            return msg ? window.location.reload() : window.close();
        },1000);}
}

//function for counting the time 
//https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown
function gameTime(){
    let decrement = setInterval(function(){
      timer.innerHTML= sec + " seconds";
      --sec;
      if(sec <= 0){
        clearInterval(decrement);
        timer.innerHTML = "Finished";
        let msg = confirm("Time Out!\nDo you want to play again?");
        return msg ? window.location.reload() : window.close();
      }
    }, 1000);
}

//function for counting the number of moves
function moveCounter(){
    ++movesNo;
    counter.innerHTML= movesNo;
    //check the stars for each increament of the move counter
    showStars();
}

//function for show the stars based on the number 
function showStars(){
    star=document.querySelector('.fa-star');
    if(movesNo === 25){
        star.classList.remove('fa-star');
        starNo=2;
    }
    else if(movesNo === 45){
        star.classList.remove('fa-star');
        starNo=1;
    }
}


/*
 * Start the execution
 */

//for each load of the page, shuffle the cards
window.onload = shuffleCards();

//to start counting the time
gameTime();

//reload the page when the restart button is clicked
restarticon.addEventListener('click',function(){
    window.location.reload();
});

//call the OpenedCard function when the user click any cards
const AllCards = document.querySelectorAll('.card');//Declare AllCards variable after calling the shufflecard function
AllCards.forEach(card => card.addEventListener('click',OpenedCard));
