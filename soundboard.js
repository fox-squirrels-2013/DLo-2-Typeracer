$(document).ready(function() {
  function sampleMaker(audiofile){
    var sample = document.createElement('audio');
    sample.setAttribute('src', "audio/"+audiofile+'.mp3');
    console.log(audiofile)
    
    $('.' + audiofile).click(function() {
        sample.play();
        console.log("hello")
    });
  };
  


  sampleMaker('correctimundo')
  sampleMaker('tasty_burger')
  sampleMaker('muthafucka')
  sampleMaker('fuck_you')
  sampleMaker('hold_on_to_your_butts')  
  sampleMaker('i_dont_remember')
  sampleMaker('please_continue')
  sampleMaker('say_what_again')
  sampleMaker('shut_the_fuck_up')
  sampleMaker('tasty_beverage')
  sampleMaker('whats_the_matter')
  sampleMaker('english_muthafucka')




});
