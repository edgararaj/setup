const express = require("express");
const path = require("path");
const fs = require("fs");
const WebSocket = require("faye-websocket");
const { spawn, spawnSync } = require("child_process");
const open = require("open");
const sass = require("sass");

function parsa(to_preprocess)
{
	const proc = spawnSync("parsa.exe", to_preprocess, {cwd: "frontend"});
	console.log(proc.stdout.toString());
	console.log(`Exited with code ${proc.status}`);
	if (!proc.status && ws) ws.send("reload");
}

function sass_render(filenames)
{
	filenames.forEach(filename => {
		const no_ext = filename.substring(0, filename.lastIndexOf("."));
		const result = sass.renderSync(
			{
				file: `frontend/${filename}`,
				indentType: "tab",
				indentWidth: 1,
			}
		);
		fs.writeFileSync(`frontend/gen/${no_ext}.css`, result.css.toString());
	});
}

const app = express();

app.use("/static", express.static(path.resolve("frontend")));

app.get("/*", function (req, res) {
	res.sendFile(path.resolve("frontend", "index.html"));
});

const port = process.env.PORT || 5700;
const server = app.listen(port, function () {
	console.log("Compiling website...");
	parsa(["main.js"]);
	sass_render(["style.scss"]);
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
fs.watch("frontend", { recursive: true }, function (event_type, filename) {
	if (watch_wait) clearTimeout(watch_wait);
	watch_wait = setTimeout(function () {
		console.log(`[FSWATCH]: ${filename} was ${event_type}`);

		const files_to_preprocess = ["main.js"];
		const to_preprocess = files_to_preprocess.filter(file => filename == file);
		if (to_preprocess.length || filename.match(".(html)$")) {
			parsa(to_preprocess);
		} else if (filename.match(".(scss)$")) {
			sass_render([filename]);
		} else if (filename.match(".(css)$") && ws) ws.send("reload");
	}, 100);
});
