const { ipcRenderer } = require("electron");
const fs = require("fs");
const settingBtn = document.getElementById("settings-btn");

fs.readFile("utils/config.json", (err, jsonString) => {
	if (err) {
		console.log("Error reading file from disk:", err);
		return;
	}
	try {
		const settings = JSON.parse(jsonString);
		const body = document.querySelector("body");
		const text = document.querySelector("#countdown");
		text.style.color = settings.textColor;
		body.style.backgroundColor = settings.backgroundColor;
	} catch (err) {
		console.log("Error parsing JSON string:", err);
	}
});

ipcRenderer.on("configs:change-color", (event, configs) => {
	const body = document.querySelector("body");
	const text = document.querySelector("#countdown");
	text.style.color = configs.textColor;
	body.style.backgroundColor = configs.backgroundColor;
});

settingBtn.addEventListener("click", () => {
	ipcRenderer.send("show-settings");
});

ipcRenderer.on("message", (param1) => {
	console.log(param1);
});
