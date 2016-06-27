// global variable for quicker accessing timer
var timerDisplay = null; // will be set when document is ready

var timer = {
  timerRunning: false,
  timeoutId: null,
  sessionType: 'session' , //initially session, can be 'session' or 'break'
  pausedAt: null, // to mark the time paused at to resume

  startTimer: function(time, sessionType){
    this.time = time;
    this.sessionType = sessionType;
    this.timerRunning = true;
    updateSessionType(this.sessionType);
    this.timeoutId = setInterval(function(){
      timer.time = timer.time - 1;
      if( timer.time <= 0 ) {
        timer.stopTimer(true);
      }
      timer.displayTime();
    }, 1000)
  },
  pauseTimer: function(){
    this.stopTimer(false); // false indicate not finished counting
  },
  resumeTimer: function(){
    this.startTimer(this.time, this.sessionType); // start paused session.
  },
  stopTimer: function(finishedCurrentSession = false) {
    clearInterval(this.timeoutId);
    this.timerRunning = false;
    // start alternate session if current session finished gracefully
    if(finishedCurrentSession === true) {
      this.startOtherSession();
    } else { // timer is paused
      this.timerPaused = true;
      this.pausedAt = this.time - 1;
    }
  },
  isRunning: function(){
    return this.timerRunning;
  },
  isPaused: function(){
    return this.timerPaused;
  },
  displayTime: function() {
    timerDisplay.text(this.time);
  },
  isSession: function(){
    return this.sessionType == 'session';
  },
  isBreak: function(){
    return this.sessionType == 'break';
  },
  startOtherSession: function(){
    this.sessionType = this.sessionType == 'session' ? 'break' : 'session'; //alternate
    var sessionTime = readTime(this.sessionType);
    this.startTimer(sessionTime, this.sessionType);
  }
};

function readTime(sessionType) {
  var id = sessionType == 'session' ? '#pomodoro-timer' : '#break-timer';
  return $('div'+id).find('span.time').text();
}

function updateSessionType(sessionType){
  var currentState = $('div#time-display').children('h1#current-state');
  var text = sessionType == 'session' ? 'Session' : 'Break!';
  currentState.text(text);
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
      timer.pauseTimer();
    } else if(timer.isPaused()){
      timer.resumeTimer();
    }else {
      time = readTime('session');
      timer.startTimer(time, 'session');
    }
  });
});