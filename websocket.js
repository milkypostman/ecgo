var numTests = 100;
var websocketServer = "ws://localhost:8080/socket";
// websocketServer = "wss://apprtc-ws.webrtc.org:8089/ws";

var postUrl = "http://localhost:8080/http";

var testCount = 0;
var runtime = 0;

function updateOpenStatus(msg) {
  var element = document.querySelector("#open-test-status");
  element.innerHTML = msg;
}

function openWebsocketTime() {
  if (testCount < numTests) {
    updateOpenStatus("Running websocket open tests: " + testCount + "/" + numTests);
    var starttime = Date.now();
    var ws = new WebSocket(websocketServer);
    ws.onopen = function () {
      var instanceTime = (Date.now() - starttime);
      runtime += instanceTime;
      ws.close();
      testCount++;
      window.setTimeout(openWebsocketTime, 0);
    };
  } else {
    updateOpenStatus("Websocket open complete: " + runtime/numTests + "ms");
    window.console.log(runtime / numTests);
  }
}

function resetTests() {
  runtime = 0;
  testCount = 0;
}

function websocketOpenTest() {
  resetTests();
  window.setTimeout(openWebsocketTime, 0);
}

function websocketSendTest() {
  resetTests();
  var starttime;
  var ws = new WebSocket(websocketServer);
  ws.onopen = function() {
    updateOpenStatus("Running websocket message tests: " + testCount + "/" + numTests);
    starttime = Date.now();
    ws.send('msg');
  };
  ws.onmessage = function(event) {
    if (testCount < numTests) {
      var instanceTime = (Date.now() - starttime);
      window.console.log('event: ' + event.data);
      testCount++;
      runtime += instanceTime;
      starttime = Date.now();
      ws.send('msg');
      updateOpenStatus("Running websocket message tests: " + testCount + "/" + numTests);
    } else {
      updateOpenStatus("Websocket msg Complete: " + runtime/numTests + "ms");
      window.console.log(runtime / numTests);
      ws.close();
    }
  };
}

function openXhrTime() {
  if (testCount < numTests) {
    updateOpenStatus("Running XHR tests: " + testCount + "/" + numTests);
    var starttime = Date.now();
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
      window.console.log("success");
      runtime += (Date.now() - starttime);
      testCount++;
      window.setTimeout(openXhrTime, 0);
    }, false);
    xhr.addEventListener("error", function() {
      window.console.log("failed");
      runtime += (Date.now() - starttime);
      testCount++;
      window.setTimeout(openXhrTime, 0);
    }, false);
    xhr.open('POST', postUrl, true);
    xhr.send("msg");
  } else {
    updateOpenStatus("XHR Complete: " + runtime/numTests + "ms");
    window.console.log(runtime / numTests);
  }
}

function xhrSendTest () {
  resetTests();
  openXhrTime();
}
