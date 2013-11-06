function typeRacerGame(answer) {
  var input = prompt(answer);
  console.log(input);
  if (input === answer) {
    console.log('You did it!');
  } else {
    console.log('You have failed :(');
  };
};