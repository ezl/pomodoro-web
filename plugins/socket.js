export default ({ app }, inject) => {
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
      self.websocket.close()
    }

    // functions to define what to do on socket events

    self.onOpen = function(event) {}

    self.onClose = function(event) {}

    self.onMessage = function(event) {
      self.lastMessage = event.data
      // update the last message so vue can find it
    }

    self.onError = function(event) {}

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
