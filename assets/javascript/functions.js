class Answer {
    constructor(id, answer, correct) {
        this.id = id;
        this.answer = answer;
        this.correct = correct;
    }
}

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

function displayQuestion(question){
    var gameAnswers = question.answers;
    gameAnswers = shuffle(gameAnswers);
    $("#question").text(question.question);
    
    $.each(gameAnswers, function(i, answer){
        $("#answer-" + (i+1)).text(answer.answer);        
    });

}