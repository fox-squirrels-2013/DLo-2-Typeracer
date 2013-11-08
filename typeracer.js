// TODO: flesh out startIntro function
// TODO: make errorCommitted and noErrorsRecently functions to wrap animated behaviors

$(document).ready(function(){

  var letterCounter = 0
  var correctAttempts = 0
  var failedAttempts = 0
  var allWords = xYZ[Math.floor(Math.random()*xYZ.length)]
  var allLetters = allWords.split("")

  $("#text_to_type").text(allWords)

  function getNextLetter() {
    return allLetters[letterCounter] 
  }

  var programActive = false

  var currentLetterAlreadyMissed = false

  startIntro()

  var correctLetter = getNextLetter()

  $(document).keypress(function(event) {
    var enteredLetterCode = event.keyCode
    var enteredLetter = String.fromCharCode(enteredLetterCode)
    if ((enteredLetter === correctLetter) && programActive) {
      if (letterCounter === 0) {
        allLetters[letterCounter] = "<span style='color:orange;'>" + allLetters[letterCounter] + "</span>"
      } else {
        allLetters[letterCounter - 1] = allLetters[letterCounter - 1].slice(0,(allLetters[letterCounter - 1].length - 7)) // removes "</span>"
        allLetters[letterCounter] = allLetters[letterCounter] + "</span>"
      }
      newText = allLetters.join("")
      $("#text_to_type").text("")
      $("#text_to_type").append(newText)
      correctAttempts += 1
      letterCounter += 1
      currentLetterAlreadyMissed = false
      checkForCompletion()
      correctLetter = getNextLetter()
      $("#error_display").text("")
    } else if (programActive && !(currentLetterAlreadyMissed)) {
      failedAttempts += 1
      currentLetterAlreadyMissed = true
      $("#error_display").text("ERROR")
    }
  })

  function checkForCompletion() {
    if (letterCounter + 1 > allLetters.length) {
      endTime = new Date()
      programActive = false
      outputWPM(getTotalTime())
      outputAccuracy()
    }
  }

  function startIntro(){
    // TODO: Implement
    startCountdown()
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
        programActive = true
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
    $("#output_time").html("Your WPM: " + wpm)
  }

  function outputAccuracy() {
    var accuracy = correctAttempts / (correctAttempts + failedAttempts)
    $("#output_accuracy").html("Your Accuracy: " + (Math.round(accuracy * 100 * 100)/100) + '%')
  }

})


