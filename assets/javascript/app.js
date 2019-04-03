//Declare game variables
var questionBank = [];
var gameQuestion;
var gameState;
var rightCount;
var wrongCount;
//var correctAnswer;

//Fill questionBank
// var fQuestion = makeQuestion("What is the name of the monkey on King Kai's planet?", ["Bubbles", "Gregory", "Puar", "Oolong"]);

questionBank.push(makeQuestion("What is the name of the monkey on King Kai's planet?", ["Bubbles", "Gregory", "Puar", "Oolong"]));
questionBank.push(makeQuestion("Who killed Krillin on Planet Namek?", ["Freiza", "Piccolo", "Vegeta", "Captain Ginyu"]));
questionBank.push(makeQuestion("Who is known as the Prince of all Sayians?", ["Vegeta", "Goku", "Raditz", "Broly"]));

//Shuffle the question bank
questionBank = shuffle(questionBank);

//console.log(fQuestion.correctAnswer());
console.log(questionBank[0].correctAnswer());

//Choose a game question


//Set question
gameQuestion = questionBank.pop();

//Display question
displayQuestion(gameQuestion);

//When user answers the question
$(".game-answer").on("click", function(){
    var result;
    var guess = $(this).text();
    //console.log(guess);
    //go through answers
    if(gameQuestion.correctAnswer() == guess){
        console.log("Correct!");
        rightCount++;
    } else {
        console.log("You lose!");
        wrongCount++;
    }

});

// var q1 = new Question();
// var q2 = new Question("haha");

// console.log(q2.answers);

// //Create first question
// var a1 = new Answer(true, "Goku");
// var a2 = new Answer(false, "Batman and Spiderman");
// var a3 = new Answer(false, "Batman");
// var a4 = new Answer(false, "Spider-Man");

// var answersPass = [];

// answersPass.push(a1);
// answersPass.push(a2);
// answersPass.push(a3);
// answersPass.push(a4);

// var q3 = new Question(answersPass);


// function howManyVowels(inString){
//     var vowelCount = 0;
//     for(i = 0; i < inString.length; i++){
//         if(inString.charAt(i).toLowerCase() == "a" || inString.charAt(i).toLowerCase() == "e" || inString.charAt(i).toLowerCase() == "i" || inString.charAt(i).toLowerCase() == "o" || inString.charAt(i).toLowerCase() == "u"){
//             vowelCount++;
//         }
//     }
//     return vowelCount;
// }

// console.log(howManyVowels("aeiouuuuuuuuhhggs"));