<template>
  <div id="container">
    <h2>Ceci n'est pas une pomodoro timer</h2>
    <div id="yesWebSocketSupport" class="bannerMessage">
      <p>This browser supports WebSockets</p>
    </div>
    <div id="noWebSocketSupport" class="bannerMessage">
      <p>This browser does not support WebSockets</p>
    </div>
    <div id="timerContainer" :class="timer.isWorkState ? 'red' : 'green'">
      <div id="countdown" />
      <div id="timerModeDisplay">
        {{ timer.isWorkState ? "Work Time" : "Rest Time" }}
      </div>
      <div id="timerButtons">
        <button :disabled="timer.getIsRunning()" @click="startTimer(true)">
          Start
        </button>
        <button :disabled="!timer.getIsRunning()" @click="stopTimer(true)">
          Stop
        </button>
        <button :disabled="timer.getIsRunning()" @click="resetTimer(true)">
          Reset
        </button>
      </div>
      <table style="display:none;"><!-- #TODO: remove -->
        <tr><td><span>isWorkState</span></td><td><span id="isWorkStateValue">{{ timer.isWorkState }}</span></td></tr>
        <tr><td><span>secondsRemaining</span></td><td><span id="secondsRemainingValue">{{ timer.getMillisecondsRemaining() }}</span></td></tr>
        <tr><td><span>isRunning</span></td><td><span id="isRunningValue">{{ timer.getIsRunning() }}</span></td></tr>
      </table>
    </div>

    <div>
      <h2>Preferences</h2>
      <table>
        <tr><td><span>work time</span></td><td><input v-model="preferences.workDuration" type="number"></input></td></tr>
        <tr><td><span>rest time</span></td><td><input v-model="preferences.restDuration" type="number"></input></td></tr>
        <tr><td><span>autostart</span></td><td><input v-model="preferences.autoStartNextSession" type="checkbox"></input></td></tr>
      </table>
      <button @click="savePreferences(true)">
        Save Preferences
      </button>
      <button :disabled="!socketManager.getIsConnected()" @click="sendPreferences">
        Send Preferences
      </button>
    </div>
    <hr>

    <h2>Just a bunch of stuff to make it easier for me while building</h2>
    <div>
      <h2>Socket Connect / Disconnect</h2>
      <no-ssr placeholder="Loading web socket buttons...">
        <button id="connectButton" :disabled="socketManager.getIsConnected()" @click="openWebSocket">
          Connect
        </button>
        <button id="disconnectButton" :disabled="socketManager.getIsDisconnected()" @click="closeWebSocket">
          Disconnect
        </button>
      </no-ssr>
    </div>
    <div>
      <h2>Send Current State</h2>
      <button :disabled="!socketManager.getIsConnected()" @click="sendState">
        Send Current State
      </button>
    </div>
    <div>
      <h2>Send Arbitrary State</h2>
      <p>
        <input id="secondsRemainingInput" v-model="secondsRemainingInputValue" type="number" min="0" step="1">
        <label for="secondsRemainingInput">secondsRemaining</label>
      </p>
      <p>
        <input id="isWorkStateInput" v-model="isWorkStateCheckboxValue" type="checkbox">
        <label for="isWorkStateInput">isWorkState</label>
      </p>
      <p>
        <input id="isRunningInput" v-model="isRunningCheckboxValue" type="checkbox">
        <label for="isRunningInput">isRunning</label>
      </p>
      <button id="sendStateButton" :disabled="!socketManager.getIsConnected()" @click="sendArbitraryState">
        Send Arbitrary State
      </button>
    </div>
    <div>
      <h2>Connected Users</h2>
      <li v-for="user in users" :key="user.name">
        Connection ID: {{ user.connectionId }}
      </li>
    </div>
    <div id="output">
      <h2>Messages</h2>
      {{ output }}
    </div>
  </div><!-- container -->
</template>

<script>
import {
  PomodoroTimer as PomodoroTimerModel,
  PomodoroState as PomodoroTimerState
} from '~/lib/timer'

import Piecon from 'piecon/piecon'
import ProgressBar from 'progressbar.js'
let countdown

const COLORS = {
  red: '#ff0000',
  green: '#008000',
  lightred: '#ffe2dd',
  lightgreen: '#e3ffdd'
}
const PATHWIDTH = 6
const TRAILWIDTH = 1

const setStylesForCountdowns = function() {
  const primary = timer.isWorkState ? COLORS.red : COLORS.green
  const secondary = timer.isWorkState ? COLORS.lightred : COLORS.lightgreen
  const contrast = timer.isWorkState ? COLORS.lightgreen : COLORS.lightred

  // piecon
  Piecon.setOptions({
    color: primary,
    background: secondary
  })

  // progressbar
  countdown.path.setAttribute('stroke', primary)
  countdown.trail.setAttribute('stroke', contrast)
  countdown.text.style.color = primary
}

function pad(num) {
  const size = 2
  return (Math.pow(10, size) + ~~num).toString().substring(1)
}

const TICKINTERVAL = 1000
const DELAYBETWEENCYCLES = 2000

const setValuesForCountdowns = function(duration = TICKINTERVAL) {
  const timeRemaining = timer.currentDuration - timer.elapsedTime
  const minutesRemaining = Math.max(0, Math.floor(timeRemaining / (60 * 1000)))
  const secondsRemaining = Math.max(0, Math.ceil((timeRemaining / 1000) % 60))
  const timeString = pad(minutesRemaining) + ':' + pad(secondsRemaining)
  const percentRemaining = Math.round(
    (timeRemaining / timer.currentDuration) * 100
  )
  const oneTick = (duration / timer.currentDuration) * 100
  Piecon.setProgress(percentRemaining - oneTick)
  if (duration === 0) {
    countdown.set((percentRemaining - oneTick) / 100)
    countdown.path.setAttribute('stroke-width', PATHWIDTH)
  } else {
    const color = timer.isWorkState ? COLORS.red : COLORS.green
    const opts = {
      from: { color: color, width: PATHWIDTH },
      to: { color: color, width: PATHWIDTH },
      duration: duration
    }
    countdown.animate((percentRemaining - oneTick) / 100, opts)
  }
  countdown.setText(timeString)
}

const animateTimerSwitch = function(delayBetweenCycles = 1000) {
  console.log('ANIMATE TIMER SWITCH')
  const fromColor = timer.isWorkState ? COLORS.lightgreen : COLORS.lightred
  const toColor = timer.isWorkState ? COLORS.green : COLORS.red
  // immediatley set timer to 1.0 with fromColor (this replaces the track
  // immediately set timer to narrow width
  countdown.path.setAttribute('stroke', fromColor)
  countdown.path.setAttribute('stroke-width', 1)
  countdown.set(1.0)
  // over delay between cycles, animate back to 1.0 with fat width and new color
  // 1/3 just show the old trail
  // 1/3 animate
  // 1/3 show the new path
  const opts = {
    from: { color: fromColor, width: TRAILWIDTH },
    to: { color: toColor, width: PATHWIDTH },
    duration: delayBetweenCycles / 2
  }
  setTimeout(function() {
    countdown.animate(1.0, opts)
  }, delayBetweenCycles / 2)
}

const timer = PomodoroTimerModel({
  tickInterval: TICKINTERVAL,
  delayBetweenCycles: DELAYBETWEENCYCLES,
  onTick: function() {
    setValuesForCountdowns(TICKINTERVAL) // Tick interval
  },
  onStateChange: function() {
    setValuesForCountdowns(0)
    setStylesForCountdowns()
    console.log('on state change')
  },
  onFinish: function() {
    animateTimerSwitch(DELAYBETWEENCYCLES)
  }
})

export default {
  components: {},
  data: function() {
    return {
      message: 'Hello World',
      socketManager: this.$socketManager,
      timer: timer,
      output: '',
      isWorkStateCheckbox: false,
      isRunningCheckbox: false,
      isWorkStateCheckboxValue: true,
      secondsRemainingInputValue: 343,
      users: [],
      preferences: {},
      isRunningCheckboxValue: false
    }
  },
  watch: {
    $socketManager: {
      handler: function(obj) {
        const msg = obj.lastMessage

        // TODO: this is stupid! just doing this
        // so i can see if it's valid json!
        function IsJsonString(str) {
          try {
            JSON.parse(str)
          } catch (e) {
            return false
          }
          return true
        }
        if (!IsJsonString(msg)) {
          return
        }

        const response = JSON.parse(msg) // full response payload
        const data = response.data // just the data key
        const messageType = response.messageType

        switch (messageType) {
          case 'state':
            const pomodoroTimerState = new PomodoroTimerState(
              data.isWorkState,
              data.millisecondsRemaining,
              data.isRunning
            )
            timer.state = pomodoroTimerState
            setValuesForCountdowns()
            setStylesForCountdowns()
            break
          case 'preferences':
            console.log("it's preferences")
            this.preferences = data
            this.savePreferences(false)
            break
          case 'join':
            console.log('join')
            this.users.push(data)
            this.sendPreferences()
            this.sendState()
            break
          case 'potato':
            console.log('potato')
            break
        }
      },
      deep: true
    }
  },
  mounted: function() {
    countdown = new ProgressBar.Circle('#countdown', {
      strokeWidth: PATHWIDTH,
      easing: { easing: 'linaear' },
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color)
        circle.path.setAttribute('stroke-width', state.width)
      },
      color: COLORS.red,
      trailColor: '#eee',
      trailWidth: TRAILWIDTH,
      svgStyle: null
    })
    setValuesForCountdowns(0)
    setStylesForCountdowns()
    this.openWebSocket()
    this.preferences = { ...timer.preferences }
  },
  methods: {
    openWebSocket: function() {
      this.$socketManager.openWebSocket()
    },
    closeWebSocket: function() {
      this.$socketManager.closeWebSocket()
    },
    startTimer: function(broadcast = false) {
      console.log('start')
      timer.start()
      setValuesForCountdowns(TICKINTERVAL)
      if (broadcast === true && this.$socketManager.getIsConnected()) {
        this.sendState()
      }
    },
    stopTimer: function(broadcast = false) {
      console.log('stop')
      timer.stop()
      if (broadcast === true && this.$socketManager.getIsConnected()) {
        this.sendState()
      }
    },
    resetTimer: function(broadcast = false) {
      timer.reset()
      if (broadcast === true && this.$socketManager.getIsConnected()) {
        this.sendState()
      }
    },
    sendState: function() {
      const payload = {
        action: 'sendmessage',
        messageType: 'state',
        data: timer.state
      }
      const message = JSON.stringify(payload)
      this.$socketManager.websocket.send(message)
    },
    sendPreferences: function() {
      console.log('clicked send preferences')
      const payload = {
        action: 'sendmessage',
        messageType: 'preferences',
        data: timer.preferences
      }
      const message = JSON.stringify(payload)
      this.$socketManager.websocket.send(message)
    },
    savePreferences: function(broadcast = false) {
      timer.preferences = this.preferences
      timer.reset()
      if (broadcast === true && this.$socketManager.getIsConnected()) {
        this.sendPreferences()
      }
    },
    updateSocketConnectionButtons: function() {
      console.log(this.$socketManager.getIsConnected() === true)
    },
    sendArbitraryState() {
      // delete this
      console.log('send arbitrary state')
      console.log(this.isWorkStateCheckboxValue)
      console.log(this.secondsRemainingInputValue)
      console.log(this.isRunningCheckboxValue)
      const state = new PomodoroTimerState(
        this.isWorkStateCheckboxValue,
        this.secondsRemainingInputValue,
        this.isRunningCheckboxValue
      )
      const payload = {
        action: 'sendmessage',
        messageType: 'state',
        data: state
      }
      const message = JSON.stringify(payload)
      this.$socketManager.websocket.send(message)
    }
  }
}
</script>

<style>
</style>
