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


const init = function() {
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
        let textInput = document.getElementById('textInput')
        let message = textInput.value;
        if (!!message) {
            sendButton.disabled = false;
        } else {
            sendButton.disabled = true;
        }
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

const formatTextMessage = function(raw) {
    let obj = {'action':'sendmessage', 'data': raw}
    return JSON.stringify(obj)
}

const doSend = function(message) {
  writeToScreen("SENT: " + message);
  websocket.send(formatTextMessage(message));
}

const writeToScreen = function(message) {
  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = message;
  output.appendChild(pre);
}

const sendMessage = function() {
    let textInput = document.getElementById('textInput')
    let message = textInput.value;
    textInput.value = '';
    if (!!message) {
        doSend(message);
    }
}
const inputChanged = function(event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
    updateButtons();
}

window.addEventListener("load", init, false);
document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('input#textInput').onchange=inputChanged;
    let textInput = document.getElementById('textInput')
    textInput.addEventListener('keyup', inputChanged);
    textInput.addEventListener('keydown', inputChanged);
}, false);
