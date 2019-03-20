const MILLISECONDS_PER_MINUTE = 60 * 1000

export const state = () => ({
  preferences: {},
  joinOrCreateModalMode: 'create',
  sessionName: '',
  userName: ''
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
    state.preferences = { ...newPreferences }
    console.log("pref set", state.preferences)
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
  }
}

export const actions = {
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
