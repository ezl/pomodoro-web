/*

  const writeToScreen = function(message) {
    const pre = document.createElement('p')
    pre.style.wordWrap = 'break-word'
    pre.innerHTML = message
    output.appendChild(pre) // output <-- reference to the dom element
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

