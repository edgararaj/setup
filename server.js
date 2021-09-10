const express = require("express");
const path = require("path");
const fs = require("fs");
const WebSocket = require("faye-websocket");
const { spawn } = require("child_process");
const open = require("open");
const sass = require("sass");

const app = express();

app.use("/static", express.static(path.resolve("frontend")));

app.get("/*", function (req, res) {
	res.sendFile(path.resolve("frontend", "index.html"));
});

const port = process.env.PORT || 5700;
const server = app.listen(port, function () {
	const url = `http://localhost:${port}`;
	console.log(`Server running at ${url}`);
	open(url);
});

let ws;
let ws_wait = false;
server.on("upgrade", function (req, socket, head) {
	if (!WebSocket.isWebSocket(req)) return;
	ws = new WebSocket(req, socket, head);
	(function () {
		let wssend = ws.send;
		ws.send = function () {
			let args = arguments;
			if (ws_wait) clearTimeout(ws_wait);
			ws_wait = setTimeout(function () {
				wssend.apply(ws, args);
				ws_wait = false;
			}, 50);
		};
	})();
});

sass.render({
	file: "frontend/style.scss",
	indentType: "tab",
	indentWidth: 1
}, function (err, result) {
	fs.writeFileSync("frontend/gen/style.css", result.css.toString());
});

let preprocessor_wait = false;
fs.watch("frontend/", { recursive: true }, function (event_type, filename) {
	if (ws_wait) return;
	if (!filename.match(".(js|html|css)$")) return;
	console.log(`[FSWATCH]: ${filename} was ${event_type}`);
	// to_preprocess = ["main.js"];
	// for (const file in to_preprocess)
	// {
	// 	if (filename == file) {
	if (preprocessor_wait) return;
	preprocessor_wait = setTimeout(function () {
		const proc = spawn("parsa.exe", ["main.js"], { cwd: path.resolve(__dirname, "frontend/") });

		proc.stdout.on("data", function (data) {
			console.log(data.toString());
		});

		proc.on("close", function (code) {
			console.log(`Exited with code ${code}`);
			preprocessor_wait = false;
			if (!code) if (ws) ws.send("reload");
		});
	}, 150);
	return;
	// }
	// }
	if (ws) ws.send("reload");
});

process.on("SIGINT", function () {
	console.log("Closing HTTP server...");
	server.close(() => {
		console.log("HTTP server closed");
		process.exit(1);
	});
});
