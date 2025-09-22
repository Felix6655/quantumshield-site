import WebSocket from "ws";
const ws = new WebSocket("ws://localhost:4011/ws");
ws.on("message", (d) => console.log("EVENT:", d.toString()));
