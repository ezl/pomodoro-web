export default ({ app }, inject) => {
  const VERBOSE = true
  const wsUri = 'wss://l0rodnqh6l.execute-api.us-east-1.amazonaws.com/dev'

  const SocketManager = function() {
    const self = {}

    self.lastMessage = ''
    self.websocket = null
    self.state = {
      readyState: 0
    }

    self.openWebSocket = function() {
      self.websocket = new WebSocket(wsUri)
      self.state.readyState = self.websocket.readyState
      self.websocket.onopen = function(event) {
        self.onOpen(event)
      }
      self.websocket.onclose = function(event) {
        self.onClose(event)
      }
      self.websocket.onmessage = function(event) {
        self.onMessage(event)
      }
      self.websocket.onerror = function(event) {
        self.onError(event)
      }
    }

    self.send = function(message) {
      self.websocket.send(message)
      if (VERBOSE === true) {
        console.log('[socket.js] MESSAGE SENT:', message)
      }
    }

    self.closeWebSocket = function() {
      self.websocket.close()
    }

    // functions to define what to do on socket events

    self.onOpen = function(event) {
      self.state.readyState = self.websocket.readyState
      if (VERBOSE === true) {
        console.log('[socket.js] OPENED web socket')
      }
    }

    self.onClose = function(event) {
      self.state.readyState = self.websocket.readyState
      if (VERBOSE === true) {
        console.log('[socket.js] CLOSED web socket')
      }
    }

    self.onMessage = function(event) {
      self.state.readyState = self.websocket.readyState
      // update the last message so vue can find it
      self.lastMessage = event.data
      if (VERBOSE === true) {
        console.log('[socket.js] MESSAGE RECEIVED', self.lastMessage)
      }
    }

    self.onError = function(event) {
      self.state.readyState = self.websocket.readyState
      if (VERBOSE === true) {
        console.log('[socket.js] SOCKET ERROR')
      }
    }

    self.getIsConnected = function() {
      if (self.websocket === null) {
        return false
      }
      return self.state.readyState === self.websocket.OPEN
    }

    self.getIsDisconnected = function() {
      if (self.websocket === null) {
        return true
      }
      return self.state.readyState === self.websocket.CLOSED
    }

    self.getIsPending = function() {
      if (self.state === null) {
        return false
      }
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
