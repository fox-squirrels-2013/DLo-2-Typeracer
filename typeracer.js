setTimeout(function(){$("#text_to_type").text(allWords)}, 1)

letterCounter = 0
correctAttempts = 0
failedAttempts = 0
allWords = "Hello there, how are you? There are many things to be typed."
allLetters = allWords.split("")

function getNextLetter() {
  return allLetters[letterCounter] 
}

var programStarted = false

startCountdown()

var correctLetter = getNextLetter()

// TODO: make it so keypresses are not tracked until countdown has completed
$(document).keypress(function(event) {
  var enteredLetterCode = event.keyCode
  var enteredLetter = String.fromCharCode(enteredLetterCode)
  // console.log(enteredLetter)
  if ((enteredLetter === correctLetter) && programStarted) {
    allLetters[letterCounter] = "<span style='color:orange;'>" + allLetters[letterCounter] + "</span>"
    newText = allLetters.join("")
    $("#text_to_type").text("")
    $("#text_to_type").append(newText)
    correctAttempts += 1
    letterCounter += 1
    checkForCompletion()
    correctLetter = getNextLetter()
    $("#error_display").text("")
  } else if (programStarted) {
    failedAttempts += 1
    $("#error_display").text("ERROR")
  }
})

function checkForCompletion() {
  if (letterCounter + 1 > allLetters.length) {
    endTime = new Date()
    outputWPM(getTotalTime())
    outputAccuracy()
  }
}

function startCountdown() {
  var secondsRemaining = 4
  var countdownTimer = setInterval(timer, 1000)
  function timer() {
    secondsRemaining -= 1
    if (secondsRemaining >= 1) {
      $("#countdown").text(secondsRemaining + "...")
    } else if (secondsRemaining === 0) {
      $("#countdown").text("Go!")
      startTime = new Date()
      programStarted = true
    } else if (secondsRemaining <= -1) {
      clearInterval(countdownTimer)
      $("#countdown").text(" ")
    }
  }
}

function getTotalTime(start, stop) {
  return endTime - startTime
}

function outputWPM(totalTime) {
  var wpm = Math.round(((letterCounter + 1)/5)/(totalTime/1000/60)*100)/100;
  document.getElementById("output_time").innerHTML = "Your WPM: " + wpm;
}

function outputAccuracy() {
  var accuracy = correctAttempts / (correctAttempts + failedAttempts)
  document.getElementById("output_accuracy").innerHTML = "Your Accuracy: " + (Math.round(accuracy * 100 * 100)/100) + '%';
}


