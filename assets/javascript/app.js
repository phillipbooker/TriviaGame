//Declare game variables
var questionBank = [];
var gameQuestion;
var gameState;
var rightCount;
var wrongCount;
var counter;

//Boolean - if true, player guessed correctly
var playerCorrect;

//Boolean - if true, time expired
var timeUp;

//Holds timeout ID for question display and answer display respectively
var questionTimer;
var answerTimer;


//Answer class
class Answer {
    constructor(id, answer, correct) {
        this.id = id;
        this.answer = answer;
        this.correct = correct;
    }
}

//Question class - holds answers and a picture
class Question {
    constructor(question, answers, picture) {
        this.question = question;
        this.answers = answers;
        this.picture = picture;
    }

    //Returns the correct answer to the question
    correctAnswer(){
        var right;
        $.each(this.answers, function(i, answer){
            if(answer.correct){
                //console.log(answer.correct);
                right = answer.answer;
            }
        });

        return(right);
    }
}

//Fisher-Yates Shuffle
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

//Creates an element using 'tag' to add to the question-field div - can give it a custom class
function addToField(tag, divClass, text){
    var questionFieldElement = $("<" + tag + ">");
    questionFieldElement.addClass(divClass);
    questionFieldElement.text(text);
    return (questionFieldElement);
}

//Takes an array of answers for a question (first answer is correct)
function makeQuestion(question, answers, picture){
    var answersPush = [];
    var correctAnswer = new Answer("c", answers[0], true);

    answersPush.push(correctAnswer);

    for(var i = 1; i < answers.length; i++){
        var wrongAnswer = new Answer("w", answers[i], false);
        answersPush.push(wrongAnswer);
    }
    
    var question = new Question(question, answersPush, picture);
    return(question);
}

//Decrements the question timer
function countDown(){
    
    if(counter > 0){
        counter--;
    } else{
        clearInterval(questionTimer);
        outOfTime();
    }
    $("#timer").text("Time remaining: " + counter);
}

//When player is out of time set timeUp to true and increase wrongCount
function outOfTime(){
    gameState = 3;
    timeUp = true;
    wrongCount++;
    resolveAnswer();
}

//Initialize game
function resetGame(){
    //Empty the game field
    $("#question-field").empty();
    $("#timer").text("");

    rightCount = 0;
    wrongCount = 0;
    counter = 30;
    timeUp = false;

    //Tell user to click in the game field to start game
    var clickHere = $("<h2>");
    clickHere.text("Click here to start!")
    clickHere.addClass("starter");
    $("#question-field").append(clickHere);

    //Initialize the question bank
    questionBank = [];
    questionBank.push(makeQuestion("What is the name of the monkey on King Kai's planet?", ["Bubbles", "Gregory", "Puar", "Oolong"], "assets/images/bubbles.png"));
    questionBank.push(makeQuestion("Who killed Krillin on Planet Namek?", ["Frieza", "Piccolo", "Vegeta", "Captain Ginyu"], "assets/images/frieza.gif"));
    questionBank.push(makeQuestion("Who is known as the Prince of all Sayians?", ["Vegeta", "Goku", "Raditz", "Broly"], "assets/images/vegeta.jpeg"));

    //Shuffle the question bank
    questionBank = shuffle(questionBank);

    //Game initialized state
    gameState = 1;
    $("#game-state").text("Game state: " + gameState);
}

//Shows question in game field by adding divs to quesiton-field
function displayQuestion(questionPass){
    //Question display state
    gameState = 2;
    $("#game-state").text("Game state: " + gameState);

    //Shuffles the order the answers appear in
    var gameAnswers = questionPass.answers;
    gameAnswers = shuffle(gameAnswers);

    //Display question in game field
    $("#question-field").append(addToField("div", "game-question", questionPass.question));
    
    //Display answers
    $.each(gameAnswers, function(i, answerLoop){
        $("#question-field").append(addToField("div", "game-answer", answerLoop.answer));
    });
    
    //Kick off the question timer
    //Reset question timer
    counter = 30;
    questionTimer = setInterval(countDown, 1000 * 1);
    $("#timer").text("Time remaining: " + counter);
    console.log("question displayed: " + questionTimer);
}

//Chooses a game question from the bank
function setQuestion(){
    

    $("#question-field").empty();
    //Set question
    gameQuestion = questionBank.pop();

    //Display question
    displayQuestion(gameQuestion);
}

//Once user has clicked game field to start game
$("#question-field").on("click", function(){
    if(gameState == 1){
        $("#question-field").empty();
        setQuestion();
    }
});

//Resets game after Game Over
$("#start-button").on("click", function(){
    if(gameState == 99){
        $("#start-button").css("display", "none");
        resetGame();
    }
});


function endGame(){
    $("#question-field").empty();
    $("#timer").text("");

    var scoreboard = $("<div>");
    scoreboard.addClass("scoreboard");

    //Add final game values to Game Over screen
    scoreboard.append(addToField("p", "", "FINAL SCORE"));
    scoreboard.append(addToField("p", "", "Correct: " + rightCount));
    scoreboard.append(addToField("p", "", "Wrong: " + wrongCount));
    

    scoreboard.append(addToField("h2", "game-over", "GAME OVER"));

    scoreboard.append(addToField("p", "restart-message", "Click the Restart button to try again!"));

    $("#question-field").append(scoreboard);
    gameState = 99;
    $("#start-button").css("display", "inline-block");
    $("#game-state").text("Game state: " + gameState);
}


function resolveAnswer(){
    //Show answer state
    if(gameState == 3){
        $("#question-field").empty();
        $("#timer").text("");

        //Stops answer timer
        clearInterval(questionTimer);

        var questionResult = $("<div>");
        questionResult.addClass("question-result");
        
        if(timeUp){
            questionResult.append(addToField("h2", "", "Time's up!"));
        } else{
            if(playerCorrect){
                questionResult.append(addToField("h2", "", "You got it!"));
            } else {
                questionResult.append(addToField("h2", "", "Wrong answer..."));
            }
        }

        // $("#question-field").append(questionResult);

        //Unused state / answer has been displayed
        gameState = 4;
        $("#game-state").text("Game state: " + gameState);

        
        //Show player correct answer and accompanying picture
        $(questionResult).append(addToField("p", "right-wrong", "Correct answer: " + gameQuestion.correctAnswer()));
        $("#question-field").append(questionResult);

        var answerPicture = $("<img>");
        answerPicture.attr("src", gameQuestion.picture);
        answerPicture.attr("alt", "Correct Answer");
        answerPicture.addClass("answer-picture")

        $("#question-field").append(answerPicture);

        //If there are questions left, set next question - otherwise end game
        if(questionBank.length > 0){
            answerTimer = setTimeout(setQuestion, 1000 * 5);
        } else {
            answerTimer = setTimeout(endGame, 1000 * 5);
        }

    }
}

function gameAnswer(){
    //When an answer is clicked
    if(gameState == 2){
        timeUp = false;
        var result;

        //Store the clicked answer in 'guess'
        var guess = $(this).text();
        //console.log(guess);

        if(gameQuestion.correctAnswer() == guess){
            console.log("Correct!");
            rightCount++;
            playerCorrect = true;
        } else {
            console.log("You lose!");
            wrongCount++;
            playerCorrect = false;
        }

        //Show answer state
        gameState = 3;
        $("#game-state").text("Game state: " + gameState);
        resolveAnswer();
    }
}

//When user answers the question
$("#question-field").on("click", ".game-answer", gameAnswer);

$(document).ready(function(){
    resetGame();
});
