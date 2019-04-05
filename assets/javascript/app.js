//Declare game variables
var questionBank = [];
var gameQuestion;
var gameState;

var rightCount;
var wrongCount;

var playerGuess;

var timeUp;

var questionTimer;
var answerTimer;

var ANSWERS_MAX = 4;
//var correctAnswer;

//Classes
class Answer {
    constructor(id, answer, correct) {
        this.id = id;
        this.answer = answer;
        this.correct = correct;
    }
}

//Needs a picture
class Question {
    constructor(question, answers) {
        this.question = question;
        this.answers = answers;
    }

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

function addToField(tag, divClass, text){
    var questionFieldElement = $("<" + tag + ">");
    questionFieldElement.addClass(divClass);
    questionFieldElement.text(text);
    return (questionFieldElement);
}

//Takes an array of answers for a question (first answer is correct)
function makeQuestion(question, answers){
    var answersPush = [];
    var correctAnswer = new Answer("c", answers[0], true);

    answersPush.push(correctAnswer);

    for(var i = 1; i < answers.length; i++){
        var wrongAnswer = new Answer("w", answers[i], false);
        answersPush.push(wrongAnswer);
    }
    
    var question = new Question(question, answersPush);
    return(question);
}

function outOfTime(){
    gameState = 3;
    timeUp = true;
    wrongCount++;
    resolveAnswer();
}

function resetGame(){
    // $("#question").text("");
    // for(var i = 0; i < ANSWERS_MAX; i++){
    //     $("#answer-" + (i+1)).text("");
    // }
    $("#question-field").empty();

    rightCount = 0;
    wrongCount = 0;

    var clickHere = $("<h2>");
    clickHere.text("Click here to start!")
    $("#question-field").append(clickHere);

    questionBank = [];
    questionBank.push(makeQuestion("What is the name of the monkey on King Kai's planet?", ["Bubbles", "Gregory", "Puar", "Oolong"]));
    questionBank.push(makeQuestion("Who killed Krillin on Planet Namek?", ["Freiza", "Piccolo", "Vegeta", "Captain Ginyu"]));
    questionBank.push(makeQuestion("Who is known as the Prince of all Sayians?", ["Vegeta", "Goku", "Raditz", "Broly"]));

    //Shuffle the question bank
    questionBank = shuffle(questionBank);

    timeUp = false;

    gameState = 1;
    $("#game-state").text("Game state: " + gameState);
}

function displayQuestion(question){
    gameState = 2;
    $("#game-state").text("Game state: " + gameState);

    var gameAnswers = question.answers;
    gameAnswers = shuffle(gameAnswers);

    //Display question
    var questionDiv = $("<div>");
    questionDiv.addClass("game-question");
    questionDiv.text(question.question);
    $("#question-field").append(questionDiv);

    // $("#question").text(question.question);
    
    //Display answers
    $.each(gameAnswers, function(i, answer){
        // $("#answer-" + (i+1)).text(answer.answer);
        var answerDiv = $("<div>");
        answerDiv.addClass("game-answer");
        answerDiv.text(answer.answer);
        $("#question-field").append(answerDiv);
    });
    
    questionTimer = setTimeout(outOfTime, 1000 * 10);
    console.log("question displayed: " + questionTimer);
}

//Choose a game question
function setQuestion(){
    //Set question
    gameQuestion = questionBank.pop();

    //Display question
    displayQuestion(gameQuestion);
}

// function gameStart(){
//     setQuestion();
// }

$("#question-field").on("click", function(){
    if(gameState == 1){
        $("#question-field").empty();
        setQuestion();
        // gameState = 2;
        // $("#game-state").text("Game state: " + gameState);
    }
});

$("#start-button").on("click", function(){
    if(gameState == 99){
        resetGame();
    }
});


function endGame(){
    //Add final game values to Game Over screen
    $("#question-field").append(addToField("h2", "", "FINAL SCORE"));
    $("#question-field").append(addToField("h2", "", "Correct: " + rightCount));
    $("#question-field").append(addToField("h2", "", "Wrong: " + wrongCount));
    $("#question-field").append(addToField("h2", "", "Click the Restart button to try again!"));

    $("#game-result").text("GAME OVER");
    gameState = 99;
    $("#game-state").text("Game state: " + gameState);
}

function showAnswer(){
    $("#question-field").empty();
    if(gameState == 4){
        if(questionBank.length > 0){
            answerTimer = setTimeout(setQuestion, 1000 * 5);
        } else {
            answerTimer = setTimeout(endGame, 1000 * 5);
        }
    }
}

function resolveAnswer(){
    if(gameState == 3){
        clearTimeout(questionTimer);
        if(timeUp){
            $("#game-result").text("Time's up...");
        } else{
            if(playerGuess){
                $("#game-result").text("You got it!");
            } else {
                $("#game-result").text("Wrong answer...");
            }
        }
        gameState = 4;
        $("#game-state").text("Game state: " + gameState);
        showAnswer();
    }
}

function gameAnswer(){
    if(gameState == 2){
        timeUp = false;
        var result;
        var guess = $(this).text();
        //console.log(guess);
        //go through answers
        if(gameQuestion.correctAnswer() == guess){
            console.log("Correct!");
            rightCount++;
            playerGuess = true;
        } else {
            console.log("You lose!");
            wrongCount++;
            playerGuess = false;
        }
        gameState = 3;
        $("#game-state").text("Game state: " + gameState);
        //go to show-result state to select new question
        resolveAnswer();
    }
}

//When user answers the question
$("#question-field").on("click", ".game-answer", gameAnswer);

$(document).ready(function(){
    resetGame();
});
