/*

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

/*

    const sendPomodoroState = function() {
      const secondsRemaining = parseFloat(
        document.getElementById('secondsRemainingInput').value || 0
      )
      const isWorkState = document.getElementById('isWorkStateInput').checked
      const isRunning = document.getElementById('isRunningInput').checked
      const pomodoroState = {
        secondsRemaining: secondsRemaining,
        isWorkState: isWorkState,
        isRunning: isRunning
      }
      const payload = {
        action: 'sendmessage',
        messageType: 'state',
        data: pomodoroState
      }
      doSend(JSON.stringify(payload))
    }

*/

// const output = document.getElementById('output') // well, if there is a socket, we'll want a place to dump output
