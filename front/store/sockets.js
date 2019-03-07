export const state = () => ({
  socketReadyState: WebSocket.CLOSED
})

export const mutations = {
  setSocketReadyState(state, socketReadyState) {
    state.socketReadyState = socketReadyState
  }
}

export const getters = {
  isConnected: state => state.socketReadyState === WebSocket.OPEN,
  isDisconnected: state => state.socketReadyState === WebSocket.CLOSED,
  isPending: state =>
    state.socketReadyState === WebSocket.CONNECTING ||
    state.socketReadyState === WebSocket.CLOSING
}
