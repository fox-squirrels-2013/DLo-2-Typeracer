// TODO: Add difficulty levels (increase speed at which rage increases, increase length of correct streak required to reduce rage.)
// TODO: Add a small amount to very beginning of intro animation, so that it fades in from black
// TODO: Don't start music until intro starts
// TODO: Add score (calculated from allLetters.length, wpm, accuracy, and difficulty bonus -- and maybe longest streak bonus) to victory screen
// TODO: Add firebase and leaderboard, with backspace button when you enter your name
// TODO: Make theme music loop, so it will play again after it ends for the first time
// TODO: Add toggle button for theme song

// TODO: Make CSS better -- things shouldn't move around screen on window resize
// TODO: Try using input button elements instead of button elements, to see if we can get rid of the highlight box that appears
// TODO: Add a special sound from SLJ for victory and defeat
// TODO: Make SLJ's face move up and down a little bit at random
// TODO: Make inactivity rage countup start about a second or so more quickly, as it seemingly should?

$(document).ready(function(){

  var letterCounter = 0
  var correctAttempts = 0
  var failedAttempts = 0
  var samJackRagePoints = 0
  var secondsOfInactivityAllowed = 1
  var streakToReduceRage = 30
  var successStreak = 0
  var ragePointsForDefeat = 10
  var chanceStreakTriggersAudio = 0.5
  var secondsEndGameScreenSlideTime = 1.5
  var allWords = wordList[Math.floor(Math.random()*wordList.length)]
  var allLetters = allWords.split("")

  $("easy").on("click", function(){
    secondsOfInactivityAllowed = 2
    streakToReduceRage = 20
    ragePointsForDefeat = 20
  })

  $("normal").on("click", function(){
    secondsOfInactivityAllowed = 1.5
    streakToReduceRage = 30
    ragePointsForDefeat = 20
  })

  $("hard").on("click", function(){
    secondsOfInactivityAllowed = 1
    streakToReduceRage = 30
    ragePointsForDefeat = 10
  })

  $("insane").on("click", function(){
    secondsOfInactivityAllowed = 0.1
    streakToReduceRage = 40
    ragePointsForDefeat = 10
  })

  $(".difficulty_button_holder button").on("click", function(){
    fadeOutStartElements()
    setTimeout(removeStartElements, 2000)
    setTimeout(function(){$("body").toggleClass('intro')}, 2000)
    setTimeout(startIntro, 2000)
  })

  function fadeOutStartElements() {
    $("#welcome_box").animate({opacity: 0, "left":"100%"}, 1000)
    setTimeout(function(){$("#easy_holder").animate({opacity: 0, "left":"130%"}, 1000)}, 200)
    setTimeout(function(){$("#normal_holder").animate({opacity: 0, "left":"130%"}, 1000)}, 400)
    setTimeout(function(){$("#hard_holder").animate({opacity: 0, "left":"130%"}, 1000)}, 600)
    setTimeout(function(){$("#insane_holder").animate({opacity: 0, "left":"130%"}, 1000)}, 800)
    setTimeout(function(){$("#created_by_box").animate({opacity: 0, "left":"115%"}, 1000)}, 1000)
  }

  function removeStartElements() {
    $("#welcome_box").remove()
    $(".difficulty_button_holder").remove()
    $("#created_by_box").remove()
  }

  function getNextLetter() {
    return allLetters[letterCounter] 
  }

  var programActive = false

  var currentLetterAlreadyMissed = false

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
        allLetters[letterCounter] = "<span style='color:#C377F2;'>" + allLetters[letterCounter] + "</span>"
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
    successStreak += 1
    if (successStreak % streakToReduceRage === 0) {
      if (Math.random() <= chanceStreakTriggersAudio) {
        var samGoodResponse = successTriggeredAudio[Math.floor(Math.random()*successTriggeredAudio.length)]
        sample(samGoodResponse)
      }
      if (samJackRagePoints > 0) {
        samJackAngerFalls()
      }
    }
    correctAttempts += 1
    letterCounter += 1
    currentLetterAlreadyMissed = false
    checkForVictory()
    correctLetter = getNextLetter()
    timeOfLastSuccess = new Date()
  }

  function checkForVictory() {
    if (letterCounter + 1 > allLetters.length) {
      gameOver()
      activateVictory()
    }
  }

  function checkForDefeat() {
    if (samJackRagePoints >= ragePointsForDefeat) {
      gameOver()  
      activateDefeat()
    }
  }

  function gameOver() {
    endTime = new Date()
    programActive = false
    clearInterval(activityTimer)
  }

  function activateVictory() {
    $('#victory_img').animate({"right": "0%"}, secondsEndGameScreenSlideTime * 1000)
    setTimeout(displayVictoryOutputs, secondsEndGameScreenSlideTime * 1000)
  }

  function displayVictoryOutputs() {
    outputWPM(getTotalTime())
    outputAccuracy() 
    outputVictoryStatement()
    outputPlayAgainButtonWin()
    outputRewardButton()   
  }

  function activateDefeat() {
    $('#defeat_img').animate({"right": "0%"}, secondsEndGameScreenSlideTime * 1000)
    setTimeout(displayDefeatOutputs, secondsEndGameScreenSlideTime * 1000)
  }

  function displayDefeatOutputs() {
    outputDefeatStatement()
    outputPlayAgainButtonLose()  
  }

  function outputPlayAgainButtonWin() {
    $(".button_holder_victory").append('<button onclick="location.reload()">Play Again!</button>')
    $(".button_holder_victory").animate({opacity:1}, 1000)
  } 

  function outputPlayAgainButtonLose() {
    $("#button_holder_lose").append('<button onclick="location.reload()">Play Again!</button>')
    $("#button_holder_lose").animate({opacity:1}, 1000)   
  }

  function outputRewardButton() {
    $("#button_holder_reward").append('<button id="reward_button">I\'d like my reward, Mr. Jackson.</button>')
    $("#reward_button").click(activateReward)
    $("#button_holder_reward").animate({opacity:1}, 1000)
  }

  function activateReward() {
    fadeOutVictoryOutputs()
    setTimeout(removeVictoryOutputs, 500)
    setTimeout(function(){$(".button_holder_victory").attr("id", "button_holder_win_reward")}, 520)
    setTimeout(displayReward, 600)
  }

  function fadeOutVictoryOutputs() {
    disablePlayAgainButton()
    $(".button_holder_victory").animate({opacity: 0}, 500)
    $("#button_holder_reward").animate({opacity: 0}, 500)
    $(".output_win").animate({opacity: 0}, 500)
  }

  function disablePlayAgainButton() {
    $(".button_holder_victory").html("")
    $(".button_holder_victory").append('<button>Play Again!</button>')
  }

  function enablePlayAgainButton() {
    $(".button_holder_victory").html("")
    $(".button_holder_victory").append('<button onclick="location.reload()">Play Again!</button>')
  }

  function removeVictoryOutputs() {
    $("#button_holder_reward").remove()
    $("#output_time").remove()
    $("#output_accuracy").remove()
    $("#output_victory").html("")
  }

  function startIntro(){
    var introSecondsRemaining = parseInt($("body").css("-webkit-animation-duration"), 10)
    var introTimer = setInterval(timer, 1000)
    function timer(){
      introSecondsRemaining -= 1
      if (introSecondsRemaining === 0) {
        clearInterval(introTimer)
        displayText()
        displaySamJack()
        displayFlames()
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
    successStreak = 0 
    checkForDefeat()
    $("#sam_jack_rage").text("Mr. Jackson's Rage Points: " + samJackRagePoints + " (if he hits " + ragePointsForDefeat + ", you lose)")    
    if (sound) {
      var samResponse = errorTriggeredAudio[Math.floor(Math.random()*errorTriggeredAudio.length)]
      sample(samResponse)
      flashLightning()
    }
    changeImageOpacities()
  }

  function samJackAngerFalls() {
    samJackRagePoints -= 1
    $("#sam_jack_rage").text("Mr. Jackson's Rage Points: " + samJackRagePoints + " (if he hits " + ragePointsForDefeat + ", you lose)") 
    changeImageOpacities()
  }

  function changeImageOpacities() {
    halfPoints = ragePointsForDefeat / 2
    if (samJackRagePoints <= (ragePointsForDefeat / 2)) {
      $("#sam_face").animate({opacity: (samJackRagePoints/halfPoints)}, 500)
    } 
    if (samJackRagePoints >= (ragePointsForDefeat / 2)) {
      $(".flames").animate({opacity: ((samJackRagePoints-halfPoints)/halfPoints)}, 500)
    }
  }

  function displayText() {
    $("#text_to_type").text(allWords)
    $("#text_to_type").animate({opacity:1}, 2000)
    $("#sam_jack_rage").text("Mr. Jackson's Rage Points: " + samJackRagePoints + " (if he hits " + ragePointsForDefeat + ", you lose)") 
    $("#sam_jack_rage").animate({opacity:1}, 2000)
  }

  function displaySamJack() {
    $("#sam_face").append("<img src='sj_pics/sj_face.png'>")
  }

  function displayFlames() {
    $("#flame_one").append("<img src='sj_pics/flames.png' style='width:400px; height:auto;'>")    
    $("#flame_two").append("<img src='sj_pics/flames.png' style='width:400px; height:auto;'>")
  }

  function startCountdown() {
    var secondsRemaining = 4
    var countdownTimer = setInterval(timer, 1000)
    function timer() {
      secondsRemaining -= 1
      if (secondsRemaining >= 1) {
        $("#countdown").text(secondsRemaining + "...")
      } else if (secondsRemaining === 0) {
        $("#countdown").text("Type, motherfucker!")
        launchProgram()
      } else if (secondsRemaining === -1) {
        clearInterval(countdownTimer)
        $("#countdown").animate({opacity:0}, 2000)
      } else if (secondsRemaining <= -3) {
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

  function outputVictoryStatement() {
    $("#output_victory").html("Congratulations -- you win!")
    $("#output_victory").animate({opacity:1}, 500)
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

  function outputDefeatStatement() {
    $("#output_defeat").html("GAME OVER -- YOU LOST!")
    $("#output_defeat").animate({opacity:1}, 500) 
  }

  function flashLightning() {
    lightningWidth = 940 + (samJackRagePoints * 60)
    if (samJackRagePoints <= (ragePointsForDefeat / 2)) {
      leftVal = Math.floor(Math.random()*150 - 75) + '%'
      topVal = Math.floor(Math.random()*120 - 60) + '%'
    } else {
      leftVal = Math.floor(Math.random()*100 - 50) + '%'
      topVal = Math.floor(Math.random()*80 - 40) + '%'
    }
    $('#lightning').css("left",leftVal)
    $('#lightning').css("top",topVal)
    $('#lightning').append("<img src='sj_pics/lightning.jpg' style='width:" + lightningWidth + "px; height:auto;'>")
    setTimeout(function(){$('#lightning').html("")}, 100)
  }

  function displayReward() {
    buttonList = ['correctimundo', 'tasty_burger', 'motherfucker', 'fuck_you', 'hold_on_to_your_butts', 
                  "i_dont_remember", 'please_continue', 'say_what_again', 'shut_the_fuck_up', 'tasty_beverage',
                  'whats_the_matter', 'english_motherfucker']
    i = buttonList.length - 1
    while (i >= 0) {
      currFilename = buttonList[i]
      buttonInnerWords = currFilename.split("_")
      j = 0
      wordCount = buttonInnerWords.length - 1
      while (j <= wordCount) {
        buttonInnerWords[j] = buttonInnerWords[j].charAt(0).toUpperCase() + buttonInnerWords[j].slice(1)
        if (buttonInnerWords[j] === "Dont") {
          buttonInnerWords[j] = "Don't"
        }
        j += 1
      }
      buttonInnerText = buttonInnerWords.join(" ")
      $("#" + currFilename).append("<button id=" + currFilename + "_btn>" + buttonInnerText + "</button>")
      sampleMaker(currFilename)
      i -= 1
    }
    $("#output_victory").html("Enjoy my words, motherfucker.")
    $("#output_victory").animate({opacity: 1}, 1000)
    enablePlayAgainButton()
    $("#button_holder_win_reward").animate({opacity: 1}, 1000)
    $("#soundboard").animate({opacity: 1}, 1000)
  }

  function sampleMaker(audiofile){
    var sample = document.createElement('audio')
    sample.setAttribute('src', "audio/" + audiofile + '.mp3')
    $('#' + audiofile + '_btn').click(function() {
        sample.play();
    })
  }

})


