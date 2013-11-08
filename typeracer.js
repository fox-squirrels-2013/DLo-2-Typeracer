// TODO: allow reduction of samJackRagePoints
// TODO: add pause button for theme song
// TODO: shift text down gently instead of instantly when accuracy and wpm display
// TODO: Add button to play again at end
// TODO: Add firebase and score (calculated from allLetters.length, wpm, and accuracy) to add leaderboard
// TODO: Add victory screen with soundboard and play again image, and victory conditions
// TODO: Add defeat screen and conditions
// TODO: Make SLJ's face move up and down a little bit at random
// TODO: Implement flames and/or more SLJ faces that are added when rage grows
// TODO: Add an instant demonstration that you've made a mistake -- either flash background color to red,
//       or do something like flashing an image of red lightning and playing a thunder sound.

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

  themeSong()
  startIntro()

  var activityTimer = setInterval(checkForInactivity, (secondsOfInactivityAllowed * 1000))

  var correctLetter = getNextLetter()

  $(document).keydown(function(event) {
    if (event.keyCode === 8) {
      event.preventDefault()
    }
  })

  $(document).keypress(function(event) {
    var enteredLetterCode = event.keyCode
    var enteredLetter = String.fromCharCode(enteredLetterCode)
    if ((enteredLetter === correctLetter) && programActive) {
      if (letterCounter === 0) {
        allLetters[letterCounter] = "<span style='color:purple;'>" + allLetters[letterCounter] + "</span>"
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
    samJackAngerGrows(true)
    currentLetterAlreadyMissed = true
  }

  function successCommitted() {
    correctAttempts += 1
    letterCounter += 1
    currentLetterAlreadyMissed = false
    checkForCompletion()
    correctLetter = getNextLetter()
    timeOfLastSuccess = new Date()
    // do something to reduce rage counter here?
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
        displaySamJack()
        startCountdown()
      }
    }
  }

  function checkForInactivity() {
    if (programActive && (((new Date() - timeOfLastSuccess)/1000) >= secondsOfInactivityAllowed)) {
      samJackAngerGrows(false)
    }
  }

  function samJackAngerGrows(sound) {
    samJackRagePoints += 1  
    if (sound) {
      var samResponse = errorTriggeredAudio[Math.floor(Math.random()*errorTriggeredAudio.length)]
      sample(samResponse)
      flashLightning()
    }
    if (samJackRagePoints <= 10) {
      $("#sam_face").animate({opacity: (samJackRagePoints/10)}, 500)
    } 
    // else {
    //   $(".flames").animate({opacity: ((samJackRagePoints-10)/10), 500})
    // }
  }

  function displayText() {
    $("#text_to_type").text(allWords)
    $("#text_to_type").animate({opacity:1}, 2000)
  }

  function displaySamJack() {
    $("#sam_face").append("<img src='sj_pics/sj_face.png'>")
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
      } else if (secondsRemaining === -1) {
        clearInterval(countdownTimer)
        $("#countdown").animate({opacity:0}, 1000)
      } else if (secondsRemaining <= -2) {
        $("#countdown").text("")
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
    $("#output_time").animate({opacity:1}, 500)
  }

  function outputAccuracy() {
    var accuracy = correctAttempts / (correctAttempts + failedAttempts)
    $("#output_accuracy").html("Your Accuracy: " + (Math.round(accuracy * 100 * 100)/100) + '%')
    $("#output_accuracy").animate({opacity:1}, 500)
  }
  
  function themeSong() {
    var sample = document.createElement('audio')
    sample.setAttribute('src', 'audio/sammyltheme.m4a')
    sample.setAttribute('autoplay','autoplay')

    $('#themesong').click(function() {
        sample.pause()
    })
  }

  function sample(audiofile) {
    var sample = document.createElement('audio')
    sample.setAttribute('src', 'audio/' + audiofile + '.mp3')
    sample.setAttribute('autoplay','autoplay')
  }

  function flashLightning() {
    leftVal = Math.floor(Math.random()*1100-500) + 'px'
    topVal = Math.floor(Math.random()*1100-500) + 'px'
    $('#lightning').css("left",leftVal)
    $('#lightning').css("top",topVal)
    $('#lightning').append("<img src='sj_pics/lightning.jpg' style='width:1000px; height:auto;'>")
    setTimeout(function(){$('#lightning').html("")}, 100)
  }

})


