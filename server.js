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
server.on("upgrade", function (req, socket, head) {
	if (!WebSocket.isWebSocket(req)) return;
	ws = new WebSocket(req, socket, head);
	let wssend = ws.send;
	ws.send = function () {
		console.log("[WEBSOCKET]: Sending reload");
		wssend.apply(ws, arguments);
	};
});

let watch_wait;
const watch_root_dir = "frontend";
fs.watch(watch_root_dir, { recursive: true }, function (event_type, filename) {
	if (watch_wait) clearTimeout(watch_wait);
	watch_wait = setTimeout(function () {
		console.log(`[FSWATCH]: ${filename} was ${event_type}`);

		const files_to_preprocess = ["main.js"];
		const to_preprocess = files_to_preprocess.filter(file => filename == file);
		if (to_preprocess.length || filename.match(".(html)$")) {
			const proc = spawn("parsa.exe", files_to_preprocess, { cwd: watch_root_dir });

			proc.stdout.on("data", function (data) {
				console.log(data.toString());
			});

			proc.on("close", function (code) {
				console.log(`Exited with code ${code}`);
				if (!code && ws) ws.send("reload");
			});
		} else if (filename.match(".(scss)$")) {
			const no_ext = filename.substring(0, filename.lastIndexOf("."));
			sass.render(
				{
					file: `${watch_root_dir}/${filename}`,
					indentType: "tab",
					indentWidth: 1,
				},
				function (err, result) {
					if (!err) fs.writeFileSync(`${watch_root_dir}/gen/${no_ext}.css`, result.css.toString());
				}
			);
		} else if (filename.match(".(css)$") && ws) ws.send("reload");
	}, 100);
});
