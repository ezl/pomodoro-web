import { PomodoroState } from '~/lib/timer'

export default ({ app }, inject) => {
  const wsUri = 'wss://l0rodnqh6l.execute-api.us-east-1.amazonaws.com/dev'

  const SocketManager = function() {
    const self = {}

    self.websocket = null
    self.state = {
      readyState: 0
    }

    self.openWebSocket = function() {
      self.websocket = new WebSocket(wsUri)
      self.websocket.onopen = function(event) {
        self.onOpen(event)
        self.state.readyState = self.websocket.readyState
      }
      self.websocket.onclose = function(event) {
        self.onClose(event)
        self.state.readyState = self.websocket.readyState
      }
      self.websocket.onmessage = function(event) {
        self.onMessage(event)
        self.state.readyState = self.websocket.readyState
      }
      self.websocket.onerror = function(event) {
        self.onError(event)
        self.state.readyState = self.websocket.readyState
      }
    }

    self.closeWebSocket = function() {
      console.log('close')
      self.websocket.close()
    }

    // functions to define what to do on socket events

    self.onOpen = function(event) {}

    self.onClose = function(event) {}

    self.onMessage = function(event) {
      const response = JSON.parse(event.data) // full response payload
      const data = response.data // just the data key
      const messageType = response.messageType

      switch (messageType) {
        case 'state':
          const pomodoroState = new PomodoroState(
            data.isWorkState,
            data.secondsRemaining * 1000,
            data.isRunning
          )
          pomodoroState.isWorkState = false

          // timer.state = pomodoroState
          break
        case 'preferences':
          // timer.preferences = data
          break
        case 'potato':
          console.log('potato')
          break
      }
    }

    self.onError = function(event) {}

    self.getIsConnected = function() {
      if (self.websocket === null) {
        return false
      }
      console.log('getIsConnected')
      return self.state.readyState === self.websocket.OPEN
    }
    self.getIsDisconnected = function() {
      if (self.websocket === null) {
        return true
      }
      console.log('getIsDisconnected')
      console.log(self.websocket.readyState)
      return self.state.readyState === self.websocket.CLOSED
    }
    self.getIsPending = function() {
      if (self.state === null) {
        return false
      }
      console.log(self.websocket)
      return (
        self.websocket.readyState === self.websocket.CONNECTING ||
        self.websocket.readyState === self.websocket.CLOSING
      )
    }
    return self
  }

  const socketManager = SocketManager(wsUri)
  inject('socketManager', socketManager)
}
