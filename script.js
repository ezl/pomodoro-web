// socket stuff

let output

// first just raw socket stuff

const setupSocket = function() {
  if (!window.WebSocket) {
    document.getElementById('noWebSocketSupport').style.display = 'block'
    return
  }

  const wsUri = 'wss://l0rodnqh6l.execute-api.us-east-1.amazonaws.com/dev'

  const output = document.getElementById('output') // well, if there is a socket, we'll want a place to dump output

  let websocket

  const openWebSocket = function() {
    websocket = new WebSocket(wsUri)
    websocket.onopen = function(event) {
      onOpen(event)
    }
    websocket.onclose = function(event) {
      onClose(event)
    }
    websocket.onmessage = function(event) {
      onMessage(event)
    }
    websocket.onerror = function(event) {
      onError(event)
    }
  }

  const closeWebSocket = function() {
    websocket.close()
  }

  // functions to define what to do on socket events

  const onOpen = function(event) {
    writeToScreen('CONNECTED')
    updateButtons()
  }

  const onClose = function(event) {
    writeToScreen('DISCONNECTED')
    updateButtons()
  }

  const onMessage = function(event) {
    writeToScreen('<p style="color: blue;">' + event.data + '</p>')
    const response = JSON.parse(event.data) // full response payload
    const data = response.data // just the data key
    const messageType = response.messageType
    console.log(data)
    console.log(messageType)

    switch (messageType) {
      case 'state':
        const pomodoroState = new PomodoroState(
          data.isWorkState,
          data.secondsRemaining * 1000,
          data.isRunning
        )
        timer.state = pomodoroState
        break
      case 'preferences':
        timer.preferences = data
        break
      case 'potato':
        console.log('potato')
        break
    }
  }

  const onError = function(event) {
    writeToScreen('<p style="color: red;">' + event.data + '</p>')
  }

  // actual manual socket actions

  const writeToScreen = function(message) {
    const pre = document.createElement('p')
    pre.style.wordWrap = 'break-word'
    pre.innerHTML = message
    output.appendChild(pre) // output <-- reference to the dom element
  }

  const doSend = function(message) {
    writeToScreen('SENT: ' + message)
    websocket.send(message)
  }

  // socket + ui + timer stuff

  const updateButtons = function() {
    const connectButton = document.getElementById('connectButton')
    const disconnectButton = document.getElementById('disconnectButton')
    const sendButton = document.getElementById('sendStateButton')
    if (websocket.readyState == websocket.OPEN) {
      connectButton.disabled = true
      disconnectButton.disabled = false
      sendButton.disabled = false
    } else if (websocket.readyState == websocket.CLOSED) {
      connectButton.disabled = false
      disconnectButton.disabled = true
      sendButton.disabled = true
    }
  }

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

  const sendPomodoroPreferences = function() {
    const preferences = timer.preferences
    console.log(preferences)
    const payload = {
      action: 'sendmessage',
      messageType: 'preferences',
      data: preferences
    }
    doSend(JSON.stringify(payload))
  }

  // bind connect/disconnect

  document.getElementById('connectButton').onclick = () => openWebSocket()
  document.getElementById('disconnectButton').onclick = () => closeWebSocket()

  // bind state/preference sending buttons

  document.getElementById('sendStateButton').onclick = () => sendPomodoroState()
  document.getElementById('sendPreferencesButton').onclick = () =>
    sendPomodoroPreferences()
}

// timer client display stuff

const TimerDisplay = function() {
  const self = {}

  self.init = function() {
    // Bind UI elements
    document.getElementById('startTimer').onclick = this.start
    document.getElementById('stopTimer').onclick = this.stop
  }

  self.timerModel = null

  self.start = () => {
    self.timerModel.start()
    self.render()
  }

  self.stop = () => {
    // self, this, etc
    self.timerModel.stop()
    self.render()
  }

  self.render = function() {
    // do stuff with the actual timer state
    const pomodoroState = self.timerModel.state
    const isWorkState = document.getElementById('isWorkStateValue')
    const secondsRemaining = document.getElementById('secondsRemainingValue')
    const isRunning = document.getElementById('isRunningValue')
    secondsRemaining.textContent = pomodoroState.millisecondsRemaining / 1000
    isRunning.textContent = pomodoroState.isRunning

    // update display based on work or rest state?
    if (this.timerModel.isWorkState == true) {
      document.getElementById('pomodoroTimer').className = 'red'
    } else {
      document.getElementById('pomodoroTimer').className = 'green'
    }
    isWorkState.textContent = pomodoroState.isWorkState

    // Update the start and stop buttons based on the timer state
    // basically, don't allow starting a running timer or stopping a stopped timer
    if (self.timerModel.getIsRunning() == true) {
      document.getElementById('startTimer').disabled = true
      document.getElementById('stopTimer').disabled = false
    } else {
      document.getElementById('startTimer').disabled = false
      document.getElementById('stopTimer').disabled = true
    }
  }
  return self
}

// window.addEventListener("load", timerStuff, false);
// window.addEventListener("load", initSocket, false);
window.addEventListener(
  'load',
  function() {
    setupSocket()

    /*
1. instantiate the Display thing.
2. define the callbacks using the display (because the display controls the dom)
3. instantiate the Model (using the callbacks)
4. attach the model to the display
*/

    internalTimer = new PomodoroTimer()
    displayTimer = new TimerDisplay((internaltimer = internalTimer))

    console.log('instantiating timerDisplay')
    const timerDisplay = new TimerDisplay()

    // the callbacks need the timerDisplay object
    const timerModelCallbacks = {
      onStateChange: function() {
        timerDisplay.render()
      },

      onTick: function() {
        timerDisplay.render()
      },

      onFinish: function() {
        timerDisplay.render()
      }
    }

    // make the internal model with the ui callbacks
    const timerModel = PomodoroTimer(timerModelCallbacks)
    window.timerModel = timerModel

    // and now attach that model back to the display
    timerDisplay.timerModel = timerModel // <-- assign it

    // timerDisplay.socket = websocket;
    timerDisplay.render()
    window.timerDisplay = timerDisplay
    timerDisplay.init()
  },
  false
)
