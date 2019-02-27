
/*

  if (!window.WebSocket) {
    document.getElementById('noWebSocketSupport').style.display = 'block'
  }

  const writeToScreen = function(message) {
    const pre = document.createElement('p')
    pre.style.wordWrap = 'break-word'
    pre.innerHTML = message
    output.appendChild(pre) // output <-- reference to the dom element
  }

  const updateButtons = function() {
    if (websocket.readyState === websocket.OPEN) {
    } else if (websocket.readyState === websocket.CLOSED) {
    }
  }

*/


// const state = timerModel.state
/*
secondsRemaining = state.millisecondsRemaining / 1000
isRunning = state.isRunning
isWorkState = state.isWorkState
*/

// do stuff with the actual timer state
/*
const pomodoroState = self.timerModel.state
secondsRemaining.textContent = pomodoroState.millisecondsRemaining / 1000
isRunning.textContent = pomodoroState.isRunning
*/
// update display based on work or rest state?
/*
if (this.timerModel.isWorkState === true) {
document.getElementById('pomodoroTimer').className = 'red'
} else {
document.getElementById('pomodoroTimer').className = 'green'
}
isWorkState.textContent = pomodoroState.isWorkState
*/
// Update the start and stop buttons based on the timer state
// basically, don't allow starting a running timer or stopping a stopped timer
/*
if (self.timerModel.getIsRunning() === true) {
  document.getElementById('startTimer').disabled = true
  document.getElementById('stopTimer').disabled = false
} else {
  document.getElementById('startTimer').disabled = false
  document.getElementById('stopTimer').disabled = true
}
*/


