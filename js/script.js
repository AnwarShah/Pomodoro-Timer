// global variable for quicker accessing timer
var timerDisplay = null; // will be set when document is ready

var timer = {
  timerRunning: false,
  timeoutId: null,
  sessionType: 'session' , //initially session, can be 'session' or 'break'
  setTimer: function(time, sessionType){
    this.sessionType = sessionType;
    this.timerRunning = true;
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
    timerDisplay.text(time);
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
  timerDisplay.text(time);
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
  timerDisplay = $('h1#running-time'); // set display

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
      timer.setTimer(time, 'session');
    }
  });
});