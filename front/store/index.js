const MILLISECONDS_PER_MINUTE = 60 * 1000
export const state = () => ({
  preferences: {},
  sessionName: null,
  userName: null
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
  },
  setPreferencesFromMinutes(state, newPreferences) {
    state.preferences = {
      autoStartNextSession: newPreferences.autoStartNextSession,
      workDuration: newPreferences.workDuration * MILLISECONDS_PER_MINUTE,
      restDuration: newPreferences.restDuration * MILLISECONDS_PER_MINUTE
    }
  },
  setSessionName(state, newSessionName) {
    state.sessionName = newSessionName
  },
  setUserName(state, newUserName) {
    state.userName = newUserName
  }
}

export const actions = {
  sendPreferences({ commit, state }, params) {
    commit('setPreferences', params || state.preferences)
    const payload = {
      action: 'sendMessage',
      messageType: 'preferences',
      data: params
    }
    this.$socketManager.send(payload)
  }
}
