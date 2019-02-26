// socket stuff

const wsUri = "wss://l0rodnqh6l.execute-api.us-east-1.amazonaws.com/dev";

var output;

// first just raw socket stuff

const doesWebSocketExist = function() {
    if (window.WebSocket) {
        // document.getElementById('yesWebSocketSupport').style.display = 'block';
    }
    else {
        document.getElementById('noWebSocketSupport').style.display = 'block';
    }
}

const initSocket = function() {
  output = document.getElementById("output");
  doesWebSocketExist();
  openWebSocket();
}

const openWebSocket = function() {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(event) { onOpen(event) };
  websocket.onclose = function(event) { onClose(event) };
  websocket.onmessage = function(event) { onMessage(event) };
  websocket.onerror = function(event) { onError(event) };
}

const closeWebSocket = function() {
  websocket.close();
}

const onOpen = function(event) {
  writeToScreen("CONNECTED");
  updateButtons();
}

const onClose =function(event) {
  writeToScreen("DISCONNECTED");
  updateButtons();
}

const onMessage = function(event) {
    writeToScreen('<p style="color: blue;">' + event.data + '</p>');
    const response = JSON.parse(event.data); // full response payload
    const data = response.data; // just the data key
    const messageType = response.messageType;
    console.log(data);
    console.log(messageType);

    switch (messageType) {
        case "state":
            const pomodoroState = new PomodoroState(data.isWorkState, data.secondsRemaining * 1000, data.isRunning);
            timer.state = pomodoroState;
            break;
        case "preferences":
            timer.preferences = data;
            break;
        case "potato":
            console.log("potato")
            break;
    }
}

const onError = function(event) {
  writeToScreen('<p style="color: red;">' + event.data + '</p>');
}

const doSend = function(message) {
  writeToScreen("SENT: " + message);
  websocket.send(message);
}

// socket + ui + timer stuff

const updateButtons = function() {
    let connectButton = document.getElementById('connectButton')
    let disconnectButton = document.getElementById('disconnectButton')
    let sendButton = document.getElementById('sendButton')
    if (websocket.readyState == websocket.OPEN) {
        connectButton.disabled = true;
        disconnectButton.disabled = false;
        sendButton.disabled = false;
    } else if (websocket.readyState == websocket.CLOSED) {
        connectButton.disabled = false;
        disconnectButton.disabled = true;
        sendButton.disabled = true;
    }
}

const writeToScreen = function(message) {
  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = message;
  output.appendChild(pre);
}

const sendPomodoroState = function() {
    let secondsRemaining = parseFloat(document.getElementById('secondsRemainingInput').value || 0);
    let isWorkState = document.getElementById('isWorkStateInput').checked;
    let isRunning = document.getElementById('isRunningInput').checked;
    let pomodoroState = {
        'secondsRemaining': secondsRemaining,
        'isWorkState': isWorkState,
        'isRunning': isRunning
    };
    let payload = {
        'action': 'sendmessage',
        'messageType': 'state',
        'data': pomodoroState
    };
    doSend(JSON.stringify(payload));
}

const sendPomodoroPreferences = function() {
    let preferences = timer.preferences;
    console.log(preferences);
    let payload = {
        'action': 'sendmessage',
        'messageType': 'preferences',
        'data': preferences
    };
    doSend(JSON.stringify(payload));
}


// timer client display stuff

const TimerDisplay = function() {
    let self = {};

    self.init = function() {
        // Bind UI elements
        document.getElementById("startTimer").onclick = this.start;
        document.getElementById("stopTimer").onclick = this.stop;
    };

    self.timerModel = null;

    self.start = () => {
        self.timerModel.start();
        self.render();
    };

    self.stop = () => {
        // self, this, etc 
        self.timerModel.stop();
        self.render();
    };
    self.render = function() {
        // do stuff with the actual timer state
        let pomodoroState = self.timerModel.state;
        let isWorkState = document.getElementById('isWorkStateValue');
        let secondsRemaining = document.getElementById('secondsRemainingValue');
        let isRunning = document.getElementById('isRunningValue');
        secondsRemaining.textContent = pomodoroState.millisecondsRemaining / 1000;
        isRunning.textContent = pomodoroState.isRunning;

        // update display based on work or rest state?
        if (this.timerModel.isWorkState == true) {
            document.getElementById("pomodoroTimer").className = "red";
        } else {
            document.getElementById("pomodoroTimer").className = "green";
        }
        isWorkState.textContent = pomodoroState.isWorkState;

        // Update the start and stop buttons based on the timer state
        // basically, don't allow starting a running timer or stopping a stopped timer
        if (self.timerModel.getIsRunning() == true) {
            document.getElementById("startTimer").disabled = true;
            document.getElementById("stopTimer").disabled = false;

        } else {
            document.getElementById("startTimer").disabled = false;
            document.getElementById("stopTimer").disabled = true;
        }

    }
    return self;
}


// window.addEventListener("load", timerStuff, false);
// window.addEventListener("load", initSocket, false);
window.addEventListener("load", function() {
    initSocket();

    console.log("instantiating timerDisplay")
    const timerDisplay = new TimerDisplay();

    // the callbacks need the timerDisplay object
    const timerModelCallbacks = {
        onStateChange: function() {
            timerDisplay.render();
        },

        onTick: function() {
            timerDisplay.render();
        },

        onFinish: function() {
            timerDisplay.render();
        }
    };

    // make the internal model with the ui callbacks
    const timerModel = PomodoroTimer(timerModelCallbacks);
    window.timerModel = timerModel

    // and now attach that model back to the display
    timerDisplay.timerModel = timerModel; // <-- assign it

    // timerDisplay.socket = websocket;
    timerDisplay.render();
    window.timerDisplay = timerDisplay;
    timerDisplay.init();

}, false);
