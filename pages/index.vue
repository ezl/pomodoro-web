<template>
  <div id="container">
    <h2>Ceci n'est pas une pomodoro timer</h2>
    <div id="yesWebSocketSupport" class="bannerMessage">
      <p>This browser supports WebSockets</p>
    </div>
    <div id="noWebSocketSupport" class="bannerMessage">
      <p>This browser does not support WebSockets</p>
    </div>
    <div :class="timer.isWorkState ? 'red' : 'green'">
      <button id="startTimer" :disabled="timer.getIsRunning()" @click="startTimer">
        Start
      </button>
      <button id="stopTimer" :disabled="!timer.getIsRunning()" @click="stopTimer">
        Stop
      </button>
      <div id="countdown" />
      <table>
        <tr><td><span>isWorkState</span></td><td><span id="isWorkStateValue">{{ timer.isWorkState }}</span></td></tr>
        <tr><td><span>secondsRemaining</span></td><td><span id="secondsRemainingValue">{{ timer.getMillisecondsRemaining() }}</span></td></tr>
        <tr><td><span>isRunning</span></td><td><span id="isRunningValue">{{ timer.getIsRunning() }}</span></td></tr>
      </table>
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
      <h2>Send Preferences</h2>
      <table>
        <tr><td><span>work time</span></td><td><input v-model="timer.preferences.workDuration" type="number"></input></td></tr>
        <tr><td><span>rest time</span></td><td><input v-model="timer.preferences.restDuration" type="number"></input></td></tr>
        <tr><td><span>autostart</span></td><td><input v-model="timer.preferences.autoStartNextSession" type="checkbox"></input></td></tr>
      </table>
      <button id="sendPreferencesButton" :disabled="!socketManager.getIsConnected()" @click="sendPreferences">
        Send Preferences
      </button>
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
/*
const Piecon = require('piecon/piecon.js')
*/
let countdown
let countdownColor = 'red'

const setStylesForCountdowns = function() {
  countdownColor = timer.isWorkState ? 'red' : 'green'
  // piecon
  if (timer.isWorkState) {
    Piecon.setOptions({
      background: '#ffe2dd',
      color: 'red'
    })
  } else {
    Piecon.setOptions({
      background: '#e3ffdd',
      color: 'green'
    })
  }

  // progressbar
}

const setValuesForCountdowns = function() {
  const timeRemaining = timer.currentDuration - timer.elapsedTime
  const percentRemaining = (timeRemaining / timer.currentDuration) * 100
  Piecon.setProgress(percentRemaining)
  countdown.animate(percentRemaining / 100)
}

const timer = PomodoroTimerModel({
  onTick: function() {
    setValuesForCountdowns()
  },
  onStateChange: function() {
    setStylesForCountdowns()
  }
})

export default {
  components: {},
  data: function() {
    return {
      message: 'Hello World',
      socketManager: this.$socketManager,
      timer: timer,
      output: 'test output',
      isWorkStateCheckbox: false,
      isRunningCheckbox: false,
      isWorkStateCheckboxValue: true,
      secondsRemainingInputValue: 343,
      isRunningCheckboxValue: false
    }
  },
  watch: {
    $socketManager: {
      handler: function(obj) {
        const msg = obj.lastMessage
        console.log('msg', msg)

        // this is stupid! just doing this
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

            break
          case 'preferences':
            console.log("it's preferences")
            console.log(data)
            timer.preferences = data
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
      strokeWidth: 6,
      duration: 500,
      color: 'red',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null,
      step: (state, bar) => {
        bar.path.setAttribute('stroke', countdownColor)
      }
    })
    setStylesForCountdowns()
    setValuesForCountdowns()
  },
  methods: {
    openWebSocket: function() {
      console.log('clicked open web socket')
      this.$socketManager.openWebSocket()
    },
    closeWebSocket: function() {
      console.log('clicked close web socket')
      this.$socketManager.closeWebSocket()
    },
    startTimer: function() {
      console.log('clicked start timer')
      timer.start()
    },
    stopTimer: function() {
      console.log('clicked start timer')
      timer.stop()
    },
    sendState: function() {
      console.log('clicked send state')
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
