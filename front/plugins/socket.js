import SocketManager from '~/lib/socketManager'

export default ({ app }, inject) => {
  const wsUri = 'wss://l0rodnqh6l.execute-api.us-east-1.amazonaws.com/dev'

  const socketManager = new SocketManager(wsUri, true)
  inject('socketManager', socketManager)
}
