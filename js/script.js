var timer = {
  timerRunning: false,
  timeoutId: null,
  timerDisplay: null,
  sessionType: 'session' , //initially session, can be 'session' or 'break'
  setTimer: function(time, timerDisplay, sessionType){
    this.sessionType = sessionType;
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
  },
  isSession: function(){
    return this.sessionType == 'session';
  },
  isBreak: function(){
    return this.sessionType == 'break';
  },
};

function readTime() {
  return $('#pomodoro-timer').find('span.time').text();
}

function updateTime(time) {
  $('#running-time').text(time);
}

function updateBigDisplay(clickedNode, time){
  var clickedForID = clickedNode.closest('div').attr('id'); // extract the id
  if(timer.sessionType == 'session' && clickedForID == 'pomodoro-timer'){
    updateTime(time)
  } else if (timer.sessionType == 'break' && clickedForID == 'break-timer'){
    updateTime(time);
  }
}

$(document).ready(function() {
  var timerDisplay = $('#running-time');

  // time decrement handler
  $('span.minus-sign').click(function(){
    if (timer.isRunning()) return; // do nothing
    var node = $(this).next();
    var newTime = parseInt(node.text(), 10) - 1;
    node.text(newTime);
    updateBigDisplay($(this), newTime);
  });

  // time increment handler
  $('span.plus-sign').click(function(){
    if (timer.isRunning()) return; // do nothing
    var node = $(this).prev();
    var newTime = parseInt(node.text(), 10) + 1
    node.text(newTime);
    updateBigDisplay($(this), newTime);
  });

  $('#time-display').click(function() {
    if (timer.isRunning()) {
      timer.stopTimer()
    } else {
      time = readTime();
      timer.setTimer(time, timerDisplay, 'session');
    }
  });
});