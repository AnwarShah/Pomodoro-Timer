function updateTime(time, timerDisplay) {
  timerDisplay.text(time);
}

function countDown(time, timerDisplay) {
  var time = time;
  var timeoutId = setInterval(function(){
    time = time - 1;
    if( time <= 0 ) clearInterval(timeoutId);
    updateTime(time, timerDisplay);
    console.log(time);
  }, 1000)
}

function readTime() {
  return $('#pomodoro-timer').find('span.time').text();
}

$(document).ready(function() {
  var timerDisplay = $('#running-time');

  // time decrement handler
  $('span.minus-sign').click(function(){
    var node = $(this).next();
    node.text(parseInt(node.text(), 10) - 1);
  });

  // time increment handler
  $('span.plus-sign').click(function(){
    var node = $(this).prev();
    node.text(parseInt(node.text(), 10) + 1);
  });

  $('#time-display').click(function() {
    time = readTime();
    countDown(time, timerDisplay);
  });
});