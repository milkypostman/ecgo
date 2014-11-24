var testCount = 0;
var runtime = 0;
var numTests = 1000;
function openWebsocketTime() {
  if (testCount < numTests) {
    var starttime = Date.now();
    var ws = new WebSocket("ws://localhost:8080/socket");
    ws.onopen = function () {
      runtime += (Date.now() - starttime);
      ws.close();
      testCount++;
      window.setTimeout(openWebsocketTime, 0);
    };
  } else {
    window.console.log(runtime / numTests)
  }
}

window.setTimeout(openWebsocketTime, 0);
