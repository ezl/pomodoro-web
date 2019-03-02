const SECONDS_PER_MINUTE = 1

// Pomodoro Timer model

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const PomodoroTimer = function(settings) {
  // Setup stuff

  const callbacks = {
    onStateChange: function() {
      console.log('Timer state changed')
    },
    onTick: function() {
      console.log('onTick')
    },
    onFinish: function() {
      console.log('Timer has finished')
    }
  }

  const preferences = {
    autoStartNextSession: true,
    workDuration: 6 * 1000 * SECONDS_PER_MINUTE,
    restDuration: 6 * 1000 * SECONDS_PER_MINUTE
  }

  const initialValues = {
    // Sensible initial values for a timer
    isWorkState: true,
    currentDuration: preferences.workDuration,
    startTime: null,
    elapsedTime: 0,
    ticker: null,
    tickInterval: 1000,
    delayBetweenCycles: 0
  }

  const init = function(pomodoroTimer) {
    settings = { ...initialValues, ...callbacks, ...settings }
    for (const key in settings) {
      pomodoroTimer[key] = settings[key]
    }

    pomodoroTimer.preferences = preferences
  }

  const pomodoroTimer = {
    // Computed properties

    getIsRunning: function() {
      return this.startTime !== null
    },

    getMillisecondsRemaining: function() {
      return this.currentDuration - this.elapsedTime
    },

    // Timer operations

    set state(newPomodoroState) {
      if (!(newPomodoroState instanceof PomodoroState)) {
        throw new Error('Expected type PomodoroState')
      }

      const oldPomodoroState = this.state
      let changed = false

      if (oldPomodoroState.isWorkState !== newPomodoroState.isWorkState) {
        this.isWorkState = newPomodoroState.isWorkState
        changed = true
      }

      if (
        oldPomodoroState.millisecondsRemaining !==
        newPomodoroState.millisecondsRemaining
      ) {
        this.currentDuration = this.isWorkState
          ? this.preferences.workDuration
          : this.preferences.restDuration
        this.elapsedTime =
          this.currentDuration - newPomodoroState.millisecondsRemaining
      }

      if (oldPomodoroState.isRunning !== newPomodoroState.isRunning) {
        if (oldPomodoroState.isRunning === true) {
          this.stop()
        } else {
          this.start()
        }
        changed = true
      }

      if (changed === true) {
        this.onStateChange()
      }
    },

    get state() {
      return new PomodoroState(
        this.isWorkState,
        this.getMillisecondsRemaining(),
        this.getIsRunning()
      )
    },

    start: function() {
      if (this.getIsRunning()) {
        return
      }

      if (this.getMillisecondsRemaining() <= 0) {
        return
      }

      const now = new Date()
      this.startTime = new Date(now - this.elapsedTime)

      this.ticker = setInterval(this.tick, this.tickInterval, this)
      this.onStateChange()
    },

    stop: function() {
      clearInterval(this.ticker)

      this.startTime = null
      this.ticker = null

      this.onStateChange()
    },

    toggleWorkState: function() {
      this.isWorkState = !this.isWorkState
    },

    // start
    // stop
    // reset
    // set time
    // toggle work state

    reset: function() {
      this.stop()
      const state = new PomodoroState(
        true,
        this.preferences.workDuration,
        false
      )
      this.state = state
      this.onStateChange()
    },

    finish: async function() {
      this.stop()
      this.onFinish()
      await sleep(this.delayBetweenCycles)
      this.toggleWorkState()
      const nextState = new PomodoroState(
        this.isWorkState,
        this.isWorkState
          ? this.preferences.workDuration
          : this.preferences.restDuration,
        this.preferences.autoStartNextSession
      )
      this.state = nextState
    },

    tick: function(self) {
      if (self.startTime == null) {
        return
      }

      const now = new Date()
      self.elapsedTime = now - self.startTime
      console.log('Tick', self.getMillisecondsRemaining())
      self.onTick()

      if (self.getMillisecondsRemaining() <= 0) {
        self.finish()
      }
    }
  }

  init(pomodoroTimer)
  return pomodoroTimer
}

/// ///////////////////////////////////////////////////////////////////////

const PomodoroState = function(isWorkState, millisecondsRemaining, isRunning) {
  const typesAreValid =
    typeof isWorkState === 'boolean' &&
    !isNaN(parseFloat(millisecondsRemaining)) &&
    typeof isRunning === 'boolean'

  if (!typesAreValid) {
    throw new Error(
      'Expected PomodoroState(isWorkState: Bool, millisecondsRemaining: Float, isRunning: Bool)'
    )
  }

  const defaults = {
    isWorkState: true,
    millisecondsRemaining: 25 * 60,
    isRunning: false
  }

  this.isWorkState = Boolean(isWorkState)
  this.millisecondsRemaining =
    parseFloat(millisecondsRemaining) || defaults.millisecondsRemaining
  this.isRunning = Boolean(isRunning)
}

export { PomodoroTimer, PomodoroState }
