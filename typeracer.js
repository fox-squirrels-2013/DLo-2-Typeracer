
setTimeout(function(){$("#text_to_type").text(all_words)}, 1)

// $(document).ready(function() {
wordCounter = 0
correctAttempts = 0
failedAttempts = 0
// var test_word = document.getElementById("text_to_type").innerHTML
all_words = "Hello there how are you"
// document.write(all_words)
individual_words = all_words.split(" ")

function getNextWord() {
  return individual_words[wordCounter] 
}

test_word = getNextWord()

function checkForSpacePressOrEnter() {
  if (event.keyCode == 32 || event.keyCode == 13) {
    evaluateWord()
    test_word = getNextWord()
    clearTextBox()
    var past_text = $("#text_to_type").text()
    past_text_each_word = past_text.split(" ")
    for (var i=0; i < wordCounter; i++) {
      past_text_each_word[i] = "<span style='color:red;'>" + past_text_each_word[i] + "</span>"
    }
    new_text = past_text_each_word.join(" ")
    $("#text_to_type").text("")
    $("#text_to_type").append(new_text)
  }
}

function evaluateWord() {
  var curr_word = document.getElementById("user_input").value
  if (curr_word[0] === ' ' || curr_word[0] === '\n') {
    curr_word = curr_word.slice(1,curr_word.length) 
  }
  console.log(curr_word)
  if (curr_word === test_word) {
    correctAttempts += 1;
    wordCounter += 1
    // CLEAR ERROR RESPONSE HERE
  } else {
    failedAttempts += 1;
    // ADD ERROR RESPONSE HERE
  }
}

function clearTextBox() {
  document.getElementById("user_input").value = ""
}

function trackTime() {
  
}

function newTime() {
  return new Date()
}

function getTotalTime(start, stop) {
  return stop - start
}

function sayHey() {
  alert('hey!');
}

function outputWPM(totalTime) {
  var wpm = Math.round(1/(totalTime/1000/60)*100)/100;
  document.getElementById("output_time").innerHTML = "Your WPM: " + wpm;
}

function outputAccuracy() {
  var accuracy = correctAttempts / (correctAttempts + failedAttempts)
  document.getElementById("output_accuracy").innerHTML = "Your Accuracy: " + (Math.round(accuracy * 100 * 100)/100) + '%';
}
// })



  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()



