var failedAttempts = 0
var correctAttempts = 0
// var test_word = document.getElementById("text_to_type").innerHTML
var test_word = 'hell'

function checkForSpacePressOrEnter() {
  if (event.keyCode == 32 || event.keyCode == 13) {
    evaluateWord()
    clearTextBox()
  };
};

function evaluateWord() {
  var curr_word = document.getElementById("user_input").value
  if (curr_word === test_word) {
    correctAttempts += 1;
  } else {
    failedAttempts += 1;
  };
};

function clearTextBox() {
  document.getElementById("user_input").value = ""
};

function trackTime() {
  
};

function newTime() {
  return new Date()
};

function getTotalTime(start, stop) {
  return stop - start
}

function sayHey() {
  alert('hey!');
};

function outputWPM(totalTime) {
  var wpm = Math.round(1/(totalTime/1000/60)*100)/100;
  document.getElementById("output_time").innerHTML = "Your WPM: " + wpm;
}

function outputAccuracy() {
  return correctAttempts / (correctAttempts + failedAttempts)
}