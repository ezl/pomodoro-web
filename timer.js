var PomodoroTimer = function(settings) {

    // Setup stuff

    const defaults = {
        duration: 1 * 60 * 1000,
        onStateChange: function() { console.log("Timer state changed"); },
        onTick: function() { console.log("Tick tick tick"); },
        onFinish: function() { console.log("Timer has finished"); }
    };

    const initialValues = {
        // Sensible initial values for a timer
        startTime: null,
        isWorkState: true,
        ticker: null
    };

    const init = function(pomodoroTimer) {
        settings = {...initialValues, ...defaults, ...settings}
        for (key in settings) {
            pomodoroTimer[key] = settings[key];
        }
    };

    const pomodoroTimer = {
        // Computed properties

        getIsRunning: function() {
            return this.startTime !== null
        },

        getElapsedTime: function() {
            if (this.getIsRunning() == true) {
                const now = new Date();
                return now - this.startTime;
            }
            return 0;
        },

        getSecondsRemaining: function() {
            return this.getIsRunning() ? this.duration - this.getElapsedTime() : this.duration;
        },

        // Timer operations

        setState: function() {
            console.log("set state");
        },

        getState: function() {
            console.log("get state");
        },

        start: function() {
            if (this.getIsRunning()) {
                return;
            }

            this.startTime = new Date();

            this.ticker = setInterval(this.tick, 1000, this);
            this.onStateChange();
        },

        stop: function() {
            clearInterval(this.ticker);
            this.ticker = false;
            this.onStateChange();
        },

        set: function() {
        },

        // start
        // stop
        // reset
        // set time
        // toggle work state

        tick: function(self) {
            self.onTick();
            if (self.startTime == null) {
                return;
            }
            if (self.getSecondsRemaining() <= 0) {
                self.onFinish();
            }
        }
    }

    init(pomodoroTimer);
    console.log("did the thing");
    return pomodoroTimer;
}

//////////////////////////////////////////////////////////////////////////

const PomodoroState = function(isWorkState, secondsRemaining, isRunning) {
    defaults = {
        isWorkState: true,
        secondsRemaining: 25 * 60,
        isRunning: false
    };
    this.isWorkState = Boolean(isWorkState) || defaults.isWorkState;
    this.secondsRemaining = parseFloat(secondsRemaining) || defaults.secondsRemaining;
    this.isRunning = Boolean(isRunning) || defaults.isRunning;
}

