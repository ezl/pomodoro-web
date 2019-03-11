class SocketManager {
  maxReconnectNumber = 20

  constructor(wsUri, store, verbose = false) {
    this.wsUri = wsUri
    this.websocket = null
    this.state = {
      readyState: 0
    }
    this.verbose = verbose
    this.reconnectState = {
      delayForNextMs: 1000,
      attempt: 0
    }
    this.listeners = {
      onOpen: [],
      onClose: [],
      onMessage: [],
      onError: []
    }
    this.store = store
    const updateReadyState = () => {
      store.commit('sockets/setSocketReadyState', this.websocket.readyState)
    }
    this.registerListener('onOpen', updateReadyState)
    this.registerListener('onOpen', () => {
      this.reconnectState.delayForNextMs = 1000
      this.reconnectState.attempt = 0
    })
    this.registerListener('onClose', updateReadyState)
    this.registerListener('onError', updateReadyState)
    this.registerListener('onError', () => {
      this.reconnect()
    })
  }

  openWebSocket() {
    this.websocket = new WebSocket(this.wsUri)
    this.store.commit('sockets/setSocketReadyState', this.websocket.readyState)
    this.websocket.onopen = event => this.onEvent('onOpen', event)
    this.websocket.onclose = event => this.onEvent('onClose', event)
    this.websocket.onmessage = event => this.onEvent('onMessage', event)
    this.websocket.onerror = event => this.onEvent('onError', event)
  }

  send(message) {
    this.websocket.send(JSON.stringify(message))
    if (this.verbose === true) {
      console.log('[socket.js] MESSAGE SENT:', message)
    }
  }

  closeWebSocket() {
    this.websocket.close()
  }

  triggerListeners(evenType) {
    for (const listener of this.listeners[evenType]) {
      listener(event)
    }
  }

  registerListener(eventType, func) {
    this.listeners[eventType].push(func)
  }

  async reconnect() {
    this.reconnectState.attempt += 1
    if (this.reconnectState.attempt < this.maxReconnectNumber) {
      console.log('reconnecting, delay', this.reconnectState.delayForNextMs)
      await new Promise(resolve =>
        setTimeout(() => {
          resolve()
        }, this.reconnectState.delayForNextMs)
      )
      this.reconnectState.delayForNextMs *= 1.5
      this.openWebSocket()
    }
  }
  // unregisterListener(eventType, key = 'default') {
  //   this.listeners[eventType] = func
  // }

  // functions to define what to do on socket events

  onEvent(eventType, event) {
    if (this.verbose === true) {
      console.log(`[socket.js] ${eventType}`)
    }
    this.triggerListeners(eventType, event)
  }

  // onClose(event) {
  //   this.state.readyState = this.websocket.readyState
  //   if (this.verbose === true) {
  //     console.log('[socket.js] CLOSED web socket')
  //   }
  // }
  //
  // onMessage(event) {
  //   this.state.readyState = this.websocket.readyState
  //   // update the last message so vue can find it
  //   this.lastMessage = event.data
  //   if (this.verbose === true) {
  //     console.log('[socket.js] MESSAGE RECEIVED', this.lastMessage)
  //   }
  // }
  //
  // onError(event) {
  //   this.state.readyState = this.websocket.readyState
  //   if (this.verbose === true) {
  //     console.log('[socket.js] SOCKET ERROR')
  //   }
  // }

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
