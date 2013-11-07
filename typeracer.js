setTimeout(function(){$("#text_to_type").text(allWords)}, 1)

letterCounter = 0
correctAttempts = 0
failedAttempts = 0
allWords = "Hello there how are you"
allLetters = allWords.split("")

function getNextLetter() {
  return allLetters[letterCounter] 
}

var correctLetter = getNextLetter()

$(document).keypress(function(event) {
  var enteredLetterCode = event.keyCode
  var enteredLetter = String.fromCharCode(enteredLetterCode)
  console.log(enteredLetter)
  if (enteredLetter === correctLetter) {
    allLetters[letterCounter] = "<span style='color:red;'>" + allLetters[letterCounter] + "</span>"
    newText = allLetters.join("")
    $("#text_to_type").text("")
    $("#text_to_type").append(newText)
    correctAttempts += 1
    letterCounter += 1
    correctLetter = getNextLetter()
    // CLEAR ERROR RESPONSE HERE
  } else {
    failedAttempts += 1
    // ADD ERROR RESPONSE HERE
  }
})

function getTotalTime(start, stop) {
  return stop - start
}

function outputWPM(totalTime) {
  var wpm = Math.round(((letterCounter + 1)/5)/(totalTime/1000/60)*100)/100;
  document.getElementById("output_time").innerHTML = "Your WPM: " + wpm;
}

function outputAccuracy() {
  var accuracy = correctAttempts / (correctAttempts + failedAttempts)
  document.getElementById("output_accuracy").innerHTML = "Your Accuracy: " + (Math.round(accuracy * 100 * 100)/100) + '%';
}


