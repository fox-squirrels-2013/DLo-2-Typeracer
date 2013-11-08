// TODO: implement samJackRagePoints

$(document).ready(function(){

  var letterCounter = 0
  var correctAttempts = 0
  var failedAttempts = 0
  var samJackRagePoints = 0
  var secondsOfInactivityAllowed = 2
  var allWords = wordList[Math.floor(Math.random()*wordList.length)]
  var allLetters = allWords.split("")

  function getNextLetter() {
    return allLetters[letterCounter] 
  }

  var programActive = false

  var currentLetterAlreadyMissed = false

  startIntro()

  var activityTimer = setInterval(checkForInactivity, (secondsOfInactivityAllowed * 1000))

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
      successCommitted()
    } else if (programActive && !(currentLetterAlreadyMissed)) {
      errorCommitted()
    }
  })

  function errorCommitted() {
    failedAttempts += 1
    samJackAngerGrows()
    currentLetterAlreadyMissed = true
    // $("#error_display").text("ERROR")
  }

  function successCommitted() {
    correctAttempts += 1
    letterCounter += 1
    currentLetterAlreadyMissed = false
    checkForCompletion()
    correctLetter = getNextLetter()
    timeOfLastSuccess = new Date()
    // $("#error_display").text("")
  }

  function checkForCompletion() {
    if (letterCounter + 1 > allLetters.length) {
      endTime = new Date()
      programActive = false
      outputWPM(getTotalTime())
      outputAccuracy()
      clearInterval(activityTimer)
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

  function checkForInactivity() {
    if (programActive && (((new Date() - timeOfLastSuccess)/1000) >= secondsOfInactivityAllowed)) {
      samJackAngerGrows()
    }
  }

  function samJackAngerGrows() {
    samJackRagePoints += 1
    // write to opacity of relevant image here
    $("#error_display").text(samJackRagePoints)
  }

  function displayText() {
    $("#text_to_type").text(allWords)
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
        launchProgram()
      } else if (secondsRemaining <= -1) {
        clearInterval(countdownTimer)
        $("#countdown").text(" ")
      }
    }
  }

  function launchProgram() {
    startTime = new Date()
    programActive = true
    /* if we allow player to play again without refreshing,
       will need to reinitialize multiple variables here */
    timeOfLastSuccess = new Date()
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
  
  function themesong(audiofile){
    var sample = document.createElement('audio');
    sample.setAttribute('src', audiofile + '.m4a');
    sample.setAttribute('autoplay','autoplay')

    $('.' + audiofile).click(function() {
        sample.pause();
    });
  };

})


