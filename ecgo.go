package main

import (
	"code.google.com/p/go.net/websocket"
	"io"
	"log"
	"net/http"
	"os"
)

func httpHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("New ", r.Method, " request.")
	io.Copy(w, r.Body)
	log.Println("Finished ", r.Method, " request.")
}

func websocketHandler(ws *websocket.Conn) {
	log.Println("websocket opened.")
	io.Copy(ws, ws)
	log.Println("websocket closed.")
}

func main() {
	log.Println("Starting ecgo server on port 8080...")

	wd, _ := os.Getwd()
	http.Handle("/socket", websocket.Handler(websocketHandler))
	http.HandleFunc("/http", httpHandler)
	http.Handle("/", http.FileServer(http.Dir(wd)))
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic("ListenandServe: " + err.Error())
	}
}
