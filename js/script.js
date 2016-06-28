// global variable for quicker accessing timer
var timerDisplay = null; // will be set when document is ready

// function which converts secons into mm:ss format
function formattedTime(seconds){
  var minute = parseInt(seconds / 60, 10);
  var seconds = seconds % 60
  seconds = seconds > 9 ? seconds : '0' + seconds;
  return (minute + ":" + seconds);
}

var timer = {
  timerRunning: false,
  timeoutId: null,
  sessionType: 'session' , //initially session, can be 'session' or 'break'

  // will be used to update time while in paused state
  setTime: function(time){
    this.time = time * 60; // time is in minute. so convert it to seconds
  },
  countDown: function(){
    timer.time = timer.time - 1;
    if( timer.time <= 0 ) {
      timer.stopTimer(true);
    }
    timer.displayTime();
  },
  startTimer: function(time, sessionType){
    this.setTime(time);
    this.sessionType = sessionType;
    this.timerRunning = true;
    updateSessionType(this.sessionType);
    this.timeoutId = setInterval(this.countDown, 1000)
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
    }
  },
  isRunning: function(){
    return this.timerRunning;
  },
  isPaused: function(){
    return this.timerPaused;
  },
  displayTime: function() {
    timerDisplay.text(formattedTime(this.time));
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

function reflectTimeUpdate(time, displayNode, clickedNode) {
  displayNode.text(time);
  timer.setTime(time);
  updateBigDisplay(clickedNode, time);
}

$(document).ready(function() {
  timerDisplay = $('h1#running-time'); // set display

  // time decrement handler
  $('span.minus-sign').click(function(){
    if (timer.isRunning()) return; // do nothing
    var node = $(this).next();
    var newTime = parseInt(node.text(), 10) - 1;
    reflectTimeUpdate(newTime, node, $(this));
  });

  // time increment handler
  $('span.plus-sign').click(function(){
    if (timer.isRunning()) return; // do nothing
    var node = $(this).prev();
    var newTime = parseInt(node.text(), 10) + 1
    reflectTimeUpdate(newTime, node, $(this));
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