import SocketManager from '~/lib/socketManager'

export default ({ app, store }, inject) => {
  const wsUri = 'wss://l0rodnqh6l.execute-api.us-east-1.amazonaws.com/dev'

  const socketManager = new SocketManager(wsUri, store, true)
  inject('socketManager', socketManager)
}
