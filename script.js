// socket stuff

const wsUri = "wss://l0rodnqh6l.execute-api.us-east-1.amazonaws.com/dev";

var output;

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
}

const onError = function(event) {
  writeToScreen('<p style="color: red;">' + event.data + '</p>');
}

const doSend = function(message) {
  writeToScreen("SENT: " + message);
  websocket.send(message);
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
        'data': pomodoroState
    };
    doSend(JSON.stringify(payload));
}



// timer client display stuff

const timerStuff = function() {
    const updateTimerDisplay = function(pomodoroState) {
        let isWorkState = document.getElementById('isWorkStateValue');
        let secondsRemaining = document.getElementById('secondsRemainingValue');
        let isRunning = document.getElementById('isRunningValue');
        isWorkState.textContent = pomodoroState.isWorkState;
        secondsRemaining.textContent = pomodoroState.millisecondsRemaining / 1000;
        isRunning.textContent = pomodoroState.isRunning;
    }

    const timerSettings = {
        onStateChange: function() {
            updateTimerDisplay(timer.state);
        },

        onTick: function() {
            updateTimerDisplay(timer.state);
        },

        onFinish: function() {
            updateTimerDisplay(timer.state);
            console.log("hi");
            updateStartStopButtons();
        }
    };

    const startTimer = function() {
        window.timer.start();
        updateStartStopButtons();
    }

    const stopTimer = function() {
        window.timer.stop();
        updateStartStopButtons();
    }
    const updateStartStopButtons = function() {
        if (timer.getIsRunning() == true) {
            document.getElementById("startTimer").disabled = true;
            document.getElementById("stopTimer").disabled = false;
        } else {
            document.getElementById("startTimer").disabled = false;
            document.getElementById("stopTimer").disabled = true;
        }
    }

    document.getElementById("startTimer").onclick = startTimer;
    document.getElementById("stopTimer").onclick = stopTimer;


    const timer = PomodoroTimer(timerSettings);
    window.timer = timer;
    updateTimerDisplay(timer.state);
}

window.addEventListener("load", timerStuff, false);
window.addEventListener("load", initSocket, false);
