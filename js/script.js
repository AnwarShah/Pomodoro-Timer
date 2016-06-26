var timer = {
  timerRunning: false,
  timeoutId: null,
  timerDisplay: null,
  setTimer: function(time, timerDisplay){
    this.timerRunning = true;
    this.timerDisplay = timerDisplay;
    this.timeoutId = setInterval(function(){
      time = time - 1;
      if( time <= 0 ) {
        timer.stopTimer();
      }
      timer.displayTime(time);
    }, 1000)
  },
  stopTimer: function() {
    clearInterval(this.timeoutId);
    this.timerRunning = false;
  },
  isRunning: function(){
    return this.timerRunning;
  },
  displayTime: function(time) {
    this.timerDisplay.text(time);
  }
};

function readTime() {
  return $('#pomodoro-timer').find('span.time').text();
}

$(document).ready(function() {
  var timerDisplay = $('#running-time');

  // time decrement handler
  $('span.minus-sign').click(function(){
    if (timer.isRunning()) return; // do nothing
    var node = $(this).next();
    node.text(parseInt(node.text(), 10) - 1);
  });

  // time increment handler
  $('span.plus-sign').click(function(){
    if (timer.isRunning()) return; // do nothing
    var node = $(this).prev();
    node.text(parseInt(node.text(), 10) + 1);
  });

  $('#time-display').click(function() {
    if (timer.isRunning()) {
      timer.stopTimer()
    } else {
      time = readTime();
      timer.setTimer(time, timerDisplay);
    }
  });
});