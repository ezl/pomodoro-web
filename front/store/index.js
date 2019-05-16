const MILLISECONDS_PER_MINUTE = 60 * 1000

export const state = () => ({
  preferences: {},
  joinOrCreateModalMode: 'create',
  sessionName: '',
  userName: '',
  userId: null
})

export const getters = {
  preferencesInMinutes: state => ({
    autoStartNextSession: state.preferences.autoStartNextSession,
    workDuration: state.preferences.workDuration / MILLISECONDS_PER_MINUTE,
    restDuration: state.preferences.restDuration / MILLISECONDS_PER_MINUTE
  })
}

export const mutations = {
  setPreferences(state, newPreferences) {
    console.log('sss', newPreferences)
    state.preferences = { ...newPreferences }
  },
  setPreferencesFromMinutes(state, newPreferences) {
    state.preferences = {
      autoStartNextSession: newPreferences.autoStartNextSession,
      workDuration: newPreferences.workDuration * MILLISECONDS_PER_MINUTE,
      restDuration: newPreferences.restDuration * MILLISECONDS_PER_MINUTE
    }
  },
  setJoinOrCreateModalMode(state, value) {
    state.joinOrCreateModalMode = value
  },
  setSessionName(state, newSessionName) {
    state.sessionName = newSessionName
    localStorage.setItem('sessionName', newSessionName)
  },
  setUserName(state, value) {
    state.userName = value
    localStorage.setItem('userName', value)
  },
  setUserId(state, value) {
    state.userId = value
  }
}

export const actions = {
  setSession({ commit, state }, newSessionName) {
    commit('setSessionName', newSessionName)
    if (this.app.router.currentRoute.params.session !== newSessionName) {
      this.app.router.replace({
        name: 'session',
        params: { session: newSessionName }
      })
    }
  },
  sendPreferences({ commit, state }, params) {
    commit('setPreferences', params || state.preferences)
    const payload = {
      action: 'sendMessage',
      messageType: 'preferences',
      data: state.preferences
    }
    this.$socketManager.send(payload)
  }
}
