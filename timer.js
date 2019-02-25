const SECONDS_PER_MINUTE = 1;

var PomodoroTimer = function(settings) {

    // Setup stuff

    const defaults = {
        workDuration: 12 * 1000 * SECONDS_PER_MINUTE,
        restDuration: 5 * 1000 * SECONDS_PER_MINUTE,

        onStateChange: function() { console.log("Timer state changed"); },
        onTick: function() { console.log("onTick"); },
        onFinish: function() { console.log("Timer has finished"); }
    };

    const initialValues = {
        // Sensible initial values for a timer
        isWorkState: true,
        currentDuration: defaults.workDuration,

        startTime: null,
        elapsedTime: 0,
        ticker: null
    };

    const preferences = {
        autostart: true
    };

    const init = function(pomodoroTimer) {
        settings = {...initialValues, ...defaults, ...settings}
        for (key in settings) {
            pomodoroTimer[key] = settings[key];
        }

        pomodoroTimer.preferences = preferences;
    };

    const pomodoroTimer = {
        // Computed properties

        getIsRunning: function() {
            return this.startTime !== null
        },

        getMillisecondsRemaining: function() {
            return this.currentDuration - this.elapsedTime;
        },

        // Timer operations

        set state(newPomodoroState) {
            if (!(newPomodoroState instanceof PomodoroState)) {
                throw "Expected type PomodoroState";
            }

            oldPomodoroState = this.state;
            let changed = false;

            if (oldPomodoroState.isWorkState != newPomodoroState.isWorkState) {
                this.isWorkState = newPomodoroState.isWorkState;
                changed = true;
            }

            if (oldPomodoroState.millisecondsRemaining != newPomodoroState.millisecondsRemaining) {
                this.currentDuration = this.isWorkState ? this.workDuration : this.restDuration;
                this.elapsedTime = this.currentDuration - newPomodoroState.millisecondsRemaining;
            }

            if (oldPomodoroState.isRunning != newPomodoroState.isRunning) {
                if (oldPomodoroState.isRunning == true) {
                    this.stop();
                } else {
                    this.start();
                }
                changed = true;
            }

            if (changed == true) {
                this.onStateChange();
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
                return;
            }

            if (this.getMillisecondsRemaining() <= 0) {
                return;
            }

            let now = new Date();
            this.startTime = new Date(now - this.elapsedTime);

            this.ticker = setInterval(this.tick, 1000, this);
            this.onStateChange();
        },

        stop: function() {
            clearInterval(this.ticker);

            this.startTime = null;
            this.ticker = null;

            this.onStateChange();
        },

        toggleWorkState: function() {
            this.isWorkState = !this.isWorkState;
        },

        // start
        // stop
        // reset
        // set time
        // toggle work state

        finish: function() {
            this.stop();
            this.toggleWorkState();
            let nextState = new PomodoroState(
                this.isWorkState,
                this.isWorkState ? this.workDuration : this.restDuration,
                this.preferences.autostart
            );
            this.state = nextState;
            this.onFinish();
        },

        tick: function(self) {
            if (self.startTime == null) {
                return;
            }

            let now = new Date();
            self.elapsedTime = now - self.startTime;
            console.log("Tick", self.getMillisecondsRemaining());
            self.onTick();

            if (self.getMillisecondsRemaining() <= 0) {
                self.finish();
            }
        }
    }

    init(pomodoroTimer);
    return pomodoroTimer;
}

//////////////////////////////////////////////////////////////////////////

const PomodoroState = function(isWorkState, millisecondsRemaining, isRunning) {
    let typesAreValid = (
        (typeof(isWorkState) == "boolean") &&
        (parseFloat(millisecondsRemaining) != NaN) &&
        (typeof(isRunning) == "boolean")
    );

    if (!typesAreValid) {
        throw "Expected PomodoroState(isWorkState: Bool, millisecondsRemaining: Float, iRunning: Bool)";
    }

    defaults = {
        isWorkState: true,
        millisecondsRemaining: 25 * 60,
        isRunning: false
    };
    this.isWorkState = Boolean(isWorkState);
    this.millisecondsRemaining = parseFloat(millisecondsRemaining) || defaults.millisecondsRemaining;
    this.isRunning = Boolean(isRunning);
}

