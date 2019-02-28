<template>
  <div id="container">
    <span>Pomodoro Timer</span>
    <no-ssr placeholder="Loading web socket buttons...">
      <button id="connectButton" :disabled="socketManager.getIsConnected()" @click="openWebSocket">
        Connect
      </button>
      <button id="disconnectButton" :disabled="socketManager.getIsDisconnected()" @click="closeWebSocket">
        Disconnect
      </button>
    </no-ssr>
    <div id="yesWebSocketSupport" class="bannerMessage">
      <p>This browser supports WebSockets</p>
    </div>
    <div id="noWebSocketSupport" class="bannerMessage">
      <p>This browser does not support WebSockets</p>
    </div>
    <div id="output">
      <h2>Messages</h2>
      {{ output }}
    </div>
    <div id="pomodoroTimer" :class="timer.isWorkState ? 'red' : 'green'">
      <h2>Ceci n'est pas une pomodoro timer</h2>
      <button id="startTimer" :disabled="timer.getIsRunning()" @click="startTimer">
        Start
      </button>
      <button id="stopTimer" :disabled="!timer.getIsRunning()" @click="stopTimer">
        Stop
      </button>
      <button :disabled="!socketManager.getIsConnected()" @click="sendState">
        Send State
      </button>
      <table>
        <tr><td><span>isWorkState</span></td><td><span id="isWorkStateValue">{{ timer.isWorkState }}</span></td></tr>
        <tr><td><span>secondsRemaining</span></td><td><span id="secondsRemainingValue">{{ timer.getMillisecondsRemaining() }}</span></td></tr>
        <tr><td><span>isRunning</span></td><td><span id="isRunningValue">{{ timer.getIsRunning() }}</span></td></tr>
      </table>
    </div>
    <div>
      <h2>Send Preferences</h2>
      <button id="sendPreferencesButton" :disabled="!socketManager.getIsConnected()" @click="sendPreferences">
        Send Preferences
      </button>
      <table>
        <tr><td><span>work time</span></td><td><span>{{ timer.preferences.workDuration }}</span></td></tr>
        <tr><td><span>rest time</span></td><td><span>{{ timer.preferences.restDuration }}</span></td></tr>
        <tr><td><span>autostart</span></td><td><span>{{ timer.preferences.autoStartNextSession }}</span></td></tr>
      </table>
    </div>
    <div>
      <h2>Send New State</h2>
      <p>
        <input id="secondsRemainingInput" type="number" min="0" step="1" value="60">
        <label for="econdsRemainingInput">secondsRemaining</label>
      </p>
      <p>
        <input id="isWorkStateInput" type="checkbox">
        <label for="isWorkStateInput">isWorkState</label>
      </p>
      <p>
        <input id="isRunningInput" type="checkbox">
        <label for="isRunningInput">isRunning</label>
      </p>
      <button id="sendStateButton" :disabled="!socketManager.getIsConnected()" @click="sendState">
        Send State
      </button>
    </div>
  </div><!-- container -->
</template>

<script>
import {
  PomodoroTimer as PomodoroTimerModel,
  PomodoroState as PomodoroTimerState
} from '~/lib/timer'
// let output

// the callbacks need the timerDisplay object
const callbacks = {
  // maybe i don't need these at all since the timer state changes itself
  // and vue can listen to that
  onStateChange: function() {
    console.log('state change')
  },
  onTick: function() {},
  onFinish: function() {}
}

// make the internal model with the ui callbacks
const timer = PomodoroTimerModel(callbacks)

export default {
  components: {},
  data: function() {
    return {
      message: 'Hello World',
      socketManager: this.$socketManager,
      timer: timer,
      output: 'test output'
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
            pomodoroTimerState.isWorkState = false
            timer.state = pomodoroTimerState

            // timer.state = pomodoroState
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
    }
  }
}
</script>

<style>
</style>
