<template>
  <div class="content">
    <SocketStatusLight />

    <div id="timerContainer" :class="timer.isWorkState ? 'red' : 'green'">
      <div id="countdown" @click="toggleTimer(true)">
        <div id="tomatoImage" />
      </div>
      <div id="timerModeDisplay">
        {{ timer.isWorkState ? "Work Time" : "Rest Time" }}
      </div>
      <div id="timerButtons">
        <button @click="toggleTimer(true)">
          {{ !timer.getIsRunning() ? 'Start' : 'Stop' }}
        </button>
        <button :disabled="timer.getIsRunning()" @click="resetTimer(true)">
          Reset
        </button>
      </div>
    </div>

    <div id="groups">
      <a v-if="this.$store.state.sessionName === ''" @click="showJoinOrCreateGroupModal">Start or Join a Pomodoro Party</a>
      <div v-else>
        You are in session <code>{{ this.$store.state.sessionName }}</code>.
        <br>
        <a @click="quitSession">Click to quit.</a>
      </div>
    </div>
    <ConnectedUsers :users="users" />

    <div style="display:none">
      <span>Socket Connect / Disconnect</span>
      <no-ssr placeholder="Loading web socket buttons...">
        <button id="connectButton" :disabled="isConnected || isPending" @click="openWebSocket">
          Connect
        </button>
        <button id="disconnectButton" :disabled="isDisconnected || isPending" @click="closeWebSocket">
          Disconnect
        </button>
      </no-ssr>
    </div>
    <div style="display: none;">
      <span>Send Current State</span>
      <button :disabled="!isConnected" @click="sendState">
        Send Current State
      </button>
    </div>
    <div style="display: none;">
      <span>Send Arbitrary State</span>
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
      <button id="sendStateButton" :disabled="!isConnected" @click="sendArbitraryState">
        Send Arbitrary State
      </button>
    </div>
    <div style="display: none;">
      <table>
        <!-- #TODO: remove -->
        <tr><td><span>isWorkState</span></td><td><span id="isWorkStateValue">{{ timer.isWorkState }}</span></td></tr>
        <tr><td><span>secondsRemaining</span></td><td><span id="secondsRemainingValue">{{ timer.getMillisecondsRemaining() }}</span></td></tr>
        <tr><td><span>isRunning</span></td><td><span id="isRunningValue">{{ timer.getIsRunning() }}</span></td></tr>
      </table>
    </div>
  </div><!-- container -->
</template>

<script>
import { mapGetters } from 'vuex'
import ConnectedUsers from '~/components/ConnectedUsers.vue'
import SocketStatusLight from '~/components/SocketStatusLight.vue'
import {
  pomodoroTimer as timer,
  PomodoroState as PomodoroTimerState
} from '~/lib/timer'

import Piecon from 'piecon/piecon'
import ProgressBar from 'progressbar.js'
let countdown

const COLORS = {
  red: '#ff0000',
  green: '#5cb85c',
  lightred: '#ffe2dd',
  lightgreen: '#e3ffdd'
}
const PATHWIDTH = 6
const TRAILWIDTH = 1

const setStylesForCountdowns = function() {
  const primary = this.isWorkState ? COLORS.red : COLORS.green
  const secondary = this.isWorkState ? COLORS.lightred : COLORS.lightgreen
  const contrast = this.isWorkState ? COLORS.lightgreen : COLORS.lightred

  // piecon
  Piecon.setOptions({
    color: primary,
    background: secondary
  })

  // progressbar
  countdown.path.setAttribute('stroke', primary)
  countdown.trail.setAttribute('stroke', contrast)
  countdown.text.style.color = primary
}.bind(timer)

function pad(num) {
  const size = 2
  return (Math.pow(10, size) + ~~num).toString().substring(1)
}

const setValuesForCountdowns = function(duration) {
  const coDuration =
    typeof duration !== 'undefined' ? duration : this.tickInterval
  const timeRemaining = this.currentDuration - this.elapsedTime
  const minutesRemaining = Math.max(0, Math.floor(timeRemaining / (60 * 1000)))
  const secondsRemaining = Math.max(0, Math.ceil((timeRemaining / 1000) % 60))
  const timeString = pad(minutesRemaining) + ':' + pad(secondsRemaining)
  const percentRemaining = Math.round(
    (timeRemaining / this.currentDuration) * 100
  )
  const oneTick = (coDuration / this.currentDuration) * 100
  Piecon.setProgress(percentRemaining - oneTick)
  if (coDuration === 0) {
    countdown.set((percentRemaining - oneTick) / 100)
    countdown.path.setAttribute('stroke-width', PATHWIDTH)
  } else {
    const color = this.isWorkState ? COLORS.red : COLORS.green
    const opts = {
      from: { color: color, width: PATHWIDTH },
      to: { color: color, width: PATHWIDTH },
      duration: coDuration
    }
    countdown.animate((percentRemaining - oneTick) / 100, opts)
  }
  countdown.setText(timeString)
}.bind(timer)

const animateTimerSwitch = function() {
  const delayBetweenCycles = this.delayBetweenCycles
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
}.bind(timer)

export default {
  components: {
    ConnectedUsers,
    SocketStatusLight
  },
  data: function() {
    return {
      message: 'Hello World',
      timer: timer,
      isWorkStateCheckbox: false,
      isRunningCheckbox: false,
      isWorkStateCheckboxValue: true,
      secondsRemainingInputValue: 343,
      users: [],
      isRunningCheckboxValue: false
    }
  },
  computed: {
    preferences() {
      return this.$store.state.preferences
    },
    ...mapGetters({
      isConnected: 'sockets/isConnected',
      isDisconnected: 'sockets/isDisconnected',
      isPending: 'sockets/isPending'
    })
  },
  watch: {
    preferences: {
      handler: function(obj) {
        timer.preferences = obj
        timer.reset()
      }
    }
  },
  created() {
    this.$socketManager.registerListener('onMessage', event => {
      const msg = event.data
      let response
      try {
        response = JSON.parse(msg)
      } catch (err) {
        return
      }
      const data = response.data
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
          this.$store.commit('setPreferences', data)
          timer.preferences = { ...data }
          break
        case 'channelMembers':
          this.users = data.members
          break
        case 'userJoined':
          console.log('user joined:', data)
          this.getChannelMembers()
          // this.users.push(data)
          // this.sendPreferences()
          this.sendState()
          break
        case 'quit':
          console.log('user quit:', data)
          // this.users.splice(this.users.indexOf(data), 1)
          this.getChannelMembers()
          break
        case 'request':
          this.$store.dispatch('sendPreferences')
          this.sendState()
          break
        case 'potato':
          break
      }
    })
    this.$socketManager.registerListener('onOpen', event => {
      console.log('on open listener being executed')
      // whenever a socket is connected, if the expects to be in
      // a specific channel, join it.
      if (this.$store.state.sessionName !== '') {
        console.log(
          'session name is non empty string, joining it',
          this.$store.state.sessionName
        )
        const msg = {
          action: 'sendMessage',
          messageType: 'joinRequest',
          data: { sessionName: this.$store.state.sessionName }
        }
        this.$socketManager.send(msg)
      }
      if (this.$store.state.userName !== '') {
        console.log(
          'username is non empty string, it is',
          this.$store.state.userName
        )
        console.log('XXXX this.store.username is:', this.$store.state.userName)
        const msg = {
          action: 'sendMessage',
          messageType: 'identify',
          data: { userName: this.$store.state.userName }
        }
        this.$socketManager.send(msg)
      }
    })
    timer.registerListener('onTick', setValuesForCountdowns)
    timer.registerListener('onStateChange', () => setValuesForCountdowns(0))
    timer.registerListener('onStateChange', setStylesForCountdowns)
    timer.registerListener('onFinish', animateTimerSwitch)
    this.$store.subscribeAction({
      after: (action, state) => {
        if (action.type === 'sendPreferences') {
          timer.stop()
        }
      }
    })
  },
  // destroyed() {
  //
  // },
  mounted() {
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
    this.$store.commit('setPreferences', timer.preferences)

    // if this person had a session before, add it and try to connect
    const sessionName = localStorage.getItem('sessionName')
    const userName = localStorage.getItem('userName')
    if (userName) {
      this.$store.commit('setUserName', userName)
    }

    if (sessionName) {
      this.$store.commit('setSessionName', sessionName)
      this.openWebSocket()
    }
  },
  methods: {
    quitSession: function() {
      this.$store.commit('setSessionName', '')
      this.closeWebSocket()
    },
    openWebSocket: function() {
      this.$socketManager.openWebSocket()
    },
    closeWebSocket: function() {
      this.$socketManager.closeWebSocket()
    },
    startTimer: function(broadcast = false) {
      timer.start()
      setValuesForCountdowns()
      if (broadcast === true && this.isConnected) {
        this.sendState()
      }
    },
    stopTimer: function(broadcast = false) {
      timer.stop()
      if (broadcast === true && this.isConnected) {
        this.sendState()
      }
    },
    toggleTimer: function(broadcast = false) {
      if (timer.getIsRunning() === true) {
        this.stopTimer(broadcast)
      } else {
        this.startTimer(broadcast)
      }
    },
    resetTimer: function(broadcast = false) {
      timer.reset()
      if (broadcast === true && this.isConnected) {
        this.sendState()
      }
    },
    showJoinOrCreateGroupModal() {
      this.openWebSocket()
      this.$modal.show('joinOrCreateGroupModal')
    },
    getChannelMembers: function() {
      const msg = {
        action: 'sendMessage',
        messageType: 'getChannelMembers'
      }
      this.$socketManager.send(msg)
    },
    sendState: function() {
      const payload = {
        action: 'sendMessage',
        messageType: 'state',
        data: timer.state
      }
      this.$socketManager.send(payload)
    },
    sendArbitraryState() {
      // delete this
      const state = new PomodoroTimerState(
        this.isWorkStateCheckboxValue,
        this.secondsRemainingInputValue,
        this.isRunningCheckboxValue
      )
      const payload = {
        action: 'sendMessage',
        messageType: 'state',
        data: state
      }
      this.$socketManager.send(payload)
    }
  }
}
</script>
<style>
#countdown {
  cursor: pointer;
}
#groups {
  padding-top: 50px;
  text-align: center;
}
</style>
