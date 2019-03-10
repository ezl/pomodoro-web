const SECONDS_PER_MINUTE = 60

const TICKINTERVAL = 1000
const DELAYBETWEENCYCLES = 2000

// Pomodoro Timer model

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class PomodoroTimer {
  // Setup stuff

  constructor(settings) {
    this.preferences = {
      autoStartNextSession: true,
      workDuration: 25 * 1000 * SECONDS_PER_MINUTE,
      restDuration: 5 * 1000 * SECONDS_PER_MINUTE
    }
    const initialValues = {
      // Sensible initial values for a timer
      isWorkState: true,
      currentDuration: this.preferences.workDuration,
      startTime: null,
      elapsedTime: 0,
      ticker: null,
      tickInterval: TICKINTERVAL,
      delayBetweenCycles: DELAYBETWEENCYCLES
    }

    const actualSettings = { ...initialValues, ...settings }
    for (const key in actualSettings) {
      this[key] = actualSettings[key]
    }
    this.listeners = {
      onStateChange: [],
      onTick: [],
      onFinish: []
    }
  }

  registerListener(event, func) {
    if (event in this.listeners) {
      this.listeners[event].push(func)
    }
  }

  triggerListener(event) {
    if (event in this.listeners) {
      for (const listener of this.listeners[event]) {
        listener()
      }
    }
  }

  //
  //

  getIsRunning() {
    return this.startTime !== null
  }

  getMillisecondsRemaining() {
    return this.currentDuration - this.elapsedTime
  }

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
      this.triggerListener('onStateChange')
    }
  }

  get state() {
    return new PomodoroState(
      this.isWorkState,
      this.getMillisecondsRemaining(),
      this.getIsRunning()
    )
  }

  start() {
    if (this.getIsRunning()) {
      return
    }

    if (this.getMillisecondsRemaining() <= 0) {
      return
    }

    const now = new Date()
    this.startTime = new Date(now - this.elapsedTime)

    this.ticker = setInterval(() => this.tick(), this.tickInterval, this)
    this.triggerListener('onStateChange')
  }

  stop() {
    clearInterval(this.ticker)

    this.startTime = null
    this.ticker = null

    this.triggerListener('onStateChange')
  }

  toggleWorkState() {
    this.isWorkState = !this.isWorkState
  }

  // start
  // stop
  // reset
  // set time
  // toggle work state

  reset() {
    this.stop()
    this.state = new PomodoroState(true, this.preferences.workDuration, false)
    this.triggerListener('onStateChange')
  }

  async finish() {
    this.stop()
    this.triggerListener('onFinish')
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
  }

  tick() {
    if (this.startTime == null) {
      return
    }

    const now = new Date()
    this.elapsedTime = now - this.startTime
    console.log('Tick', this.getMillisecondsRemaining())
    this.triggerListener('onTick')

    if (this.getMillisecondsRemaining() <= 0) {
      this.finish()
    }
  }
}

/// ///////////////////////////////////////////////////////////////////////

class PomodoroState {
  constructor(isWorkState, millisecondsRemaining, isRunning) {
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
}
const pomodoroTimer = new PomodoroTimer()

export { pomodoroTimer, PomodoroState }
