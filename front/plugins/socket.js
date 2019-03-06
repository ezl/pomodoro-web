export default ({ app }, inject) => {
  const VERBOSE = true
  const wsUri = 'wss://l0rodnqh6l.execute-api.us-east-1.amazonaws.com/dev'

  class SocketManager {

    constructor (wsUri) {
      this.wsUri = wsUri
      this.lastMessage = ''
      this.websocket = null
      this.state = {
        readyState: 0
      }
    }


    openWebSocket () {
      this.websocket = new WebSocket(wsUri)
      this.state.readyState = this.websocket.readyState
      this.websocket.onopen = (event) => {
        this.onOpen(event)
      }
      this.websocket.onclose = (event) => {
        this.onClose(event)
      }
      this.websocket.onmessage = (event) => {
        this.onMessage(event)
      }
      this.websocket.onerror =  (event) => {
        this.onError(event)
      }
    }

    send (message) {
      this.websocket.send(message)
      if (VERBOSE === true) {
        console.log('[socket.js] MESSAGE SENT:', message)
      }
    }

    closeWebSocket () {
      this.websocket.close()
    }

    // functions to define what to do on socket events

    onOpen (event) {
      this.state.readyState = this.websocket.readyState
      if (VERBOSE === true) {
        console.log('[socket.js] OPENED web socket')
      }
    }

    onClose (event) {
      this.state.readyState = this.websocket.readyState
      if (VERBOSE === true) {
        console.log('[socket.js] CLOSED web socket')
      }
    }

    onMessage (event) {
      this.state.readyState = this.websocket.readyState
      // update the last message so vue can find it
      this.lastMessage = event.data
      if (VERBOSE === true) {
        console.log('[socket.js] MESSAGE RECEIVED', this.lastMessage)
      }
    }

    onError (event) {
      this.state.readyState = this.websocket.readyState
      if (VERBOSE === true) {
        console.log('[socket.js] SOCKET ERROR')
      }
    }

    getIsConnected () {
      if (this.websocket === null) {
        return false
      }
      return this.state.readyState === this.websocket.OPEN
    }

    getIsDisconnected () {
      if (this.websocket === null) {
        return true
      }
      return this.state.readyState === this.websocket.CLOSED
    }

    getIsPending () {
      if (this.state === null) {
        return false
      }
      return (
        this.websocket.readyState === this.websocket.CONNECTING ||
        this.websocket.readyState === this.websocket.CLOSING
      )
    }

  }

  const socketManager = new SocketManager(wsUri)
  inject('socketManager', socketManager)
}
