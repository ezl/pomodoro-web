class SocketManager {
  constructor(wsUri, verbose = false) {
    this.wsUri = wsUri
    this.lastMessage = ''
    this.websocket = null
    this.state = {
      readyState: 0
    }
    this.verbose = verbose
  }

  openWebSocket() {
    this.websocket = new WebSocket(this.wsUri)
    this.state.readyState = this.websocket.readyState
    this.websocket.onopen = event => this.onOpen(event)
    this.websocket.onclose = event => this.onClose(event)
    this.websocket.onmessage = event => this.onMessage(event)
    this.websocket.onerror = event => this.onError(event)
  }

  send(message) {
    this.websocket.send(message)
    if (this.verbose === true) {
      console.log('[socket.js] MESSAGE SENT:', message)
    }
  }

  closeWebSocket() {
    this.websocket.close()
  }

  // functions to define what to do on socket events

  onOpen(event) {
    this.state.readyState = this.websocket.readyState
    if (this.verbose === true) {
      console.log('[socket.js] OPENED web socket')
    }
  }

  onClose(event) {
    this.state.readyState = this.websocket.readyState
    if (this.verbose === true) {
      console.log('[socket.js] CLOSED web socket')
    }
  }

  onMessage(event) {
    this.state.readyState = this.websocket.readyState
    // update the last message so vue can find it
    this.lastMessage = event.data
    if (this.verbose === true) {
      console.log('[socket.js] MESSAGE RECEIVED', this.lastMessage)
    }
  }

  onError(event) {
    this.state.readyState = this.websocket.readyState
    if (this.verbose === true) {
      console.log('[socket.js] SOCKET ERROR')
    }
  }

  getIsConnected() {
    if (this.websocket === null) {
      return false
    }
    return this.state.readyState === this.websocket.OPEN
  }

  getIsDisconnected() {
    if (this.websocket === null) {
      return true
    }
    return this.state.readyState === this.websocket.CLOSED
  }

  getIsPending() {
    if (this.state === null) {
      return false
    }
    return (
      this.websocket.readyState === this.websocket.CONNECTING ||
      this.websocket.readyState === this.websocket.CLOSING
    )
  }
}

export default SocketManager
