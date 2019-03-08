import SocketManager from '~/lib/socketManager'

export default ({ app, store }, inject) => {
  const socketManager = new SocketManager(process.env.WS_URL, store, true)
  inject('socketManager', socketManager)
}
