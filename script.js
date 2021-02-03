//Challenge 1
function ageInDays(){
    
    let birthYear = prompt("What year where you born?");
    let birthMonth = prompt("What month where you born?");
    let birthDay = prompt("What day where you born?")
   
    let today = new Date();
    let birthDate = new Date(birthYear + "-" + birthMonth + "-" + birthDay);

    let diff = today - birthDate;
    var h1 = document.createElement('h1');
    var textAnswer = document.createTextNode('You are ' + (diff/(1000*60*60*24)).toFixed() + " days old");
    h1.setAttribute('id', 'ageInDays');
    h1.appendChild(textAnswer);
    document.getElementById('flex-box-result').appendChild(h1);

} 

function reset(){
    document.getElementById('ageInDays').remove();
}

//Blackjack
let blackjackGame = {  //reference of YOU and DEALER
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div':'#dealer-box', 'score': 0},
    'cards' : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardMap' : {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A':[1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'standState': false,
    'turnsOver': false,
    'youTurnOver': false,

};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']
//sounds
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const loseSound = new Audio('sounds/aww.mp3');
//actionListeners
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);  //action of button Hit
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal); //action of button Deal
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic); //action of button Stand

function blackjackHit(){
    if(blackjackGame['standState'] === false){
        let card = randomCard();
        showCard(card,YOU);
        updateScore(card,YOU);
        showScore(YOU);
    }
    blackjackGame['youTurnOver'] = true;
}

function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer){
    if(activePlayer['score']<=21){
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal(){
    if(blackjackGame['turnsOver'] === true){
        blackjackGame['standState'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        
        for(i=0; i<yourImages.length; i++){
            yourImages[i].remove(); 
        }
        
        for(i=0; i<dealerImages.length; i++){
            dealerImages[i].remove(); 
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector(YOU['scoreSpan']).textContent = '0';
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).textContent = '0';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
        document.querySelector('#blackjack-result').textContent = 'Lets Play';
        document.querySelector('#blackjack-result').style.color = 'black';
        
        blackjackGame['turnsOver'] = true;
    }
}

function updateScore(card, activePlayer){
    if(card === 'A'){
        if(activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardMap'][card][1];
        }else{
            activePlayer['score'] += blackjackGame['cardMap'][card][0];
        }
    }else{
        activePlayer['score'] += blackjackGame['cardMap'][card];
    }
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color =  'red';
    }else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }    
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
    if(blackjackGame['youTurnOver'] === true){
        blackjackGame['youTurnOver'] = false;
        blackjackGame['standState'] = true;
        
        while (DEALER['score'] < 18 && blackjackGame['standState'] === true){
            let card = randomCard();
            showCard(card, DEALER);
            updateScore(card, DEALER);
            showScore(DEALER);
            await sleep(1000);
        }
        
        blackjackGame['turnsOver'] = true;
        showResult(computeWinner());
    }    
}
//keeps track of wins, losses and draws
function computeWinner(){
    
    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackGame['wins']++;
            winner = YOU;
        }else if(YOU['score'] < DEALER['score']){
            blackjackGame['losses']++;
            winner = DEALER;
        }else if(YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
            winner = 'none';
        }
    }else if(DEALER['score'] > 21){
            blackjackGame['draws']++;
            winner = 'none'; 
    }else if(DEALER['score'] <= 21){
            blackjackGame['losses']++;
            winner = DEALER;
    }
    return winner;
}

function showResult(winner){
    let msg;
    let msgColor;

    if(blackjackGame['turnsOver'] === true){
        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            msg = 'You win';
            msgColor = 'green';
            winSound.play();
        }else if(winner === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            msg = 'You lost';
            msgColor = 'red';
            loseSound.play();
        }else{
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            msg = 'You drew';
            msgColor = 'black';
        }

        document.querySelector('#blackjack-result').textContent = msg;
        document.querySelector('#blackjack-result').style.color = msgColor;
    }
}
