// TODO: flesh out startIntro function
// TODO: make errorCommitted and noErrorsRecently functions to wrap animated behaviors

$(document).ready(function(){

  var letterCounter = 0
  var correctAttempts = 0
  var failedAttempts = 0
  var allWords = wordList[Math.floor(Math.random()*wordList.length)]
  var allLetters = allWords.split("")

  function getNextLetter() {
    return allLetters[letterCounter] 
  }

  var programActive = false

  var currentLetterAlreadyMissed = false

  startIntro()

  var correctLetter = getNextLetter()

  // having everything in this callback makes it pretty hard to read.  would prefer a refactoring to use oojs.
  $(document).keypress(function(event) {
    var enteredLetterCode = event.keyCode
    var enteredLetter = String.fromCharCode(enteredLetterCode)
    if ((enteredLetter === correctLetter) && programActive) {
      if (letterCounter === 0) {
        allLetters[letterCounter] = "<span style='color:orange;'>" + allLetters[letterCounter] + "</span>"
      } else {
        // this next line is pretty janky.  srsly
        // Allows no customization. Only allows for letter by letter checking. no word by word, for example.
        allLetters[letterCounter - 1] = allLetters[letterCounter - 1].slice(0,(allLetters[letterCounter - 1].length - 7)) // removes "</span>"
        allLetters[letterCounter] = allLetters[letterCounter] + "</span>"
      }
      newText = allLetters.join("")
      $("#text_to_type").text("")
      $("#text_to_type").append(newText)
      correctAttempts += 1  // nice way to track correct and failed attempts.  that's cool.
      letterCounter += 1
      currentLetterAlreadyMissed = false
      checkForCompletion()
      correctLetter = getNextLetter() // had to look around for this function because most are below but this one's above
      $("#error_display").text("")
    } else if (programActive && !(currentLetterAlreadyMissed)) {
      failedAttempts += 1
      currentLetterAlreadyMissed = true
      $("#error_display").text("ERROR")  // a better error message would be more helpful.  this confused us from a UX perspective.
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
    introDuration = parseInt($("body").css("-webkit-animation-duration"), 10)
    var secondsRemaining = introDuration
    var introTimer = setInterval(timer, 1000)
    function timer(){
      secondsRemaining -= 1
      if (secondsRemaining === 0) {
        clearInterval(introTimer)
        displayText()
        startCountdown()
      }
    }
  }

  function displayText() {
    $("#text_to_type").text(allWords)
  }

// this seems pretty complicated for a countdown
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

// sweet!
  function outputWPM(totalTime) {
    var wpm = Math.round(((letterCounter + 1)/5)/(totalTime/1000/60)*100)/100;
    $("#output_time").html("Your WPM: " + wpm)
  }
// sweeter!
  function outputAccuracy() {
    var accuracy = correctAttempts / (correctAttempts + failedAttempts)
    $("#output_accuracy").html("Your Accuracy: " + (Math.round(accuracy * 100 * 100)/100) + '%')
  }

})


