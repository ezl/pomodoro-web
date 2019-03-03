export const state = () => ({
  preferences: {}
})

export const mutations = {
  setPreferences(state, newPreferences) {
    state.preferences = { ...newPreferences }
  }
}
