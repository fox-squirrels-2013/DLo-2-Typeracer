// TODO: Create a fake 'top scores' list and seed it
// TODO: Create a top scores page, with button from opening page
// TODO: Use a conditional in activateVictory to give user correct page (high score or normal victory)
// TODO: Create new text for victory screen that displays if and only if your score is a top score
// TODO: Let this new 'high score' victory screen take input from you for your name; will need 'submit' button and 'backspace' button. Submission can lead to high score page.
// TODO: Integrate Firebase to make the leaderboard real
// TODO: Change spellings to 'Muthaphukka'
// TODO: Add toggle button for theme song (Daniel E already built in an event listener and id for this) 
// TODO: Use CSS trick I used on difficulty page text to fix up text on victory, defeat screens, perhaps even in-game typing screen (both for text and face/flame images)
// TODO: Check to ensure that visitor is using Chrome. If they aren't, only show them a page that tells them to download it and come back.

// TODO: Make CSS better -- things shouldn't move around screen on window resize
// TODO: Make the intro animation fade in from black
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
  var score = 0
  var accuracy = 0
  var wpm = 0
  var longestSuccessStreak = 0
  var ragePointsForDefeat = 10
  var chanceStreakTriggersAudio = 0.5
  var secondsEndGameScreenSlideTime = 1.5
  var difficultyMultiplier
  var allWords = wordList[Math.floor(Math.random()*wordList.length)]
  var allLetters = allWords.split("")

  $("#easy_holder").on("click", function(){
    secondsOfInactivityAllowed = 2
    streakToReduceRage = 20
    ragePointsForDefeat = 20
    difficultyMultiplier = 1
  })

  $("#normal_holder").on("click", function(){
    secondsOfInactivityAllowed = 1.5
    streakToReduceRage = 30
    ragePointsForDefeat = 20
    difficultyMultiplier = 2
  })

  $("#hard_holder").on("click", function(){
    secondsOfInactivityAllowed = 1
    streakToReduceRage = 30
    ragePointsForDefeat = 10
    difficultyMultiplier = 3
  })

  $("#insane_holder").on("click", function(){
    secondsOfInactivityAllowed = 0.2
    streakToReduceRage = 40
    ragePointsForDefeat = 10
    difficultyMultiplier = 4
  })

  $(".difficulty_button_holder button").on("click", function(){
    fadeOutStartElements()
    setTimeout(removeStartElements, 1500)
    setTimeout(function(){$("body").toggleClass('intro')}, 1500)
    setTimeout(startIntro, 1500)
  })

  function fadeOutStartElements() {
    $("#welcome_box").animate({opacity: 0, "left":"100%"}, 1000)
    setTimeout(function(){$("#easy_holder").animate({opacity: 0, "left":"130%"}, 1000)}, 100)
    setTimeout(function(){$("#normal_holder").animate({opacity: 0, "left":"130%"}, 1000)}, 200)
    setTimeout(function(){$("#hard_holder").animate({opacity: 0, "left":"130%"}, 1000)}, 300)
    setTimeout(function(){$("#insane_holder").animate({opacity: 0, "left":"130%"}, 1000)}, 400)
    setTimeout(function(){$("#created_by_box").animate({opacity: 0, "left":"115%"}, 1000)}, 500)
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

  var activityTimer = setInterval(checkForInactivity, 50)

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
    if (successStreak > longestSuccessStreak) {
      longestSuccessStreak = successStreak
    }
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
    calculateScore(getTotalTime())
    setTimeout(displayVictoryOutputs, secondsEndGameScreenSlideTime * 1000)
  }

  function displayVictoryOutputs() {
    outputVictoryStatement()
    outputScore() 
    $(".output_win").animate({opacity:1}, 500)
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
    $("#output_line_1").remove()
    $("#output_line_2").remove()
    $("#output_line_3").remove()    
    $("#output_victory").html("")
  }

  function startIntro(){
    themeSong().play()
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
      timeOfLastSuccess = new Date()
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
    timeOfLastSuccess = new Date()
  }

  function getTotalTime(start, stop) {
    return endTime - startTime
  }

  function calculateScore(totalTime) {
    wpm = Math.round(((letterCounter + 1)/5.5)/(totalTime/1000/60)*100)/100
    accuracy = correctAttempts / (correctAttempts + failedAttempts)
    score = Math.round(difficultyMultiplier * (wpm * accuracy + allLetters.length + longestSuccessStreak))
  }

  function outputScore() {
    $("#output_line_1").html("WPM: " + wpm)
    $("#output_line_2").html("Longest Streak: " + longestSuccessStreak)
    $("#output_line_3").append("Your Score: " + "<em style='color:#9966FF'>" + score + "</em>")
  }

  function outputVictoryStatement() {
    $("#output_victory").html("Congratulations -- you win!")
  }
  
  function themeSong() {
    var sample = document.createElement('audio')
    sample.setAttribute('src', 'audio/sammyltheme.m4a')
    sample.loop = true
    $('#themesong').click(function() {
        sample.pause()
    })
    return sample
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
    $("#output_victory").html("Partake of my words, motherfucker.")
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


