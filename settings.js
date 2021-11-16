const { ipcRenderer } = require("electron");
const fs = require("fs");

let textColor = document.getElementById("textColor");
let backgroundColor = document.getElementById("backgroundColor");
let AlwaysOnTopButtonSwitcher = document.getElementById("alwaysOnTopSwitcher");

let saveBtn = document.getElementById("save-button");
let cancelBtn = document.getElementById("cancel-button");
let resetBtn = document.getElementById("reset-button");


saveBtn.addEventListener("click", () => {
	console.log("clicked");
	//write settings into json file
	const configs = {
		textColor: textColor.value,
		backgroundColor: backgroundColor.value,
		alwaysOnTop: AlwaysOnTopButtonSwitcher.checked
	};

	const jsonString = JSON.stringify(configs);

	console.log(jsonString);
	fs.writeFile("./utils/config.json", jsonString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		} else {
			console.log("Successfully wrote file");
			ipcRenderer.send("configs:change-color", configs);
			ipcRenderer.send("configs:change-alwaysOnTop", configs.alwaysOnTop);
			ipcRenderer.send("hide-settings");
		}
	});
});

cancelBtn.addEventListener("click", () => {
	ipcRenderer.send("hide-settings");
});

resetBtn.addEventListener("click", () => {
	console.log("clicked");
	//write settings into json file
	const configs = {
		textColor: "#333333",
		backgroundColor: "#ffd049",
	};

	const jsonString = JSON.stringify(configs);

	console.log(jsonString);
	fs.writeFile("./utils/config.json", jsonString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		} else {
			console.log("Successfully wrote file");
			ipcRenderer.send("configs:change-color", configs);
			ipcRenderer.send("hide-settings");
		}
	});
});

ipcRenderer.on("get-config-data", (event) => {
	fs.readFile("utils/config.json", (err, jsonString) => {
		if (err) {
			console.log("Error reading file from disk:", err);
			return;
		}
		try {
			const settings = JSON.parse(jsonString);
			const textInput = document.querySelector("#textColor");
			const bgInput = document.querySelector("#backgroundColor");
			textInput.value = settings.textColor;
			bgInput.value = settings.backgroundColor;
			AlwaysOnTopButtonSwitcher.checked = settings.alwaysOnTop;
		} catch (err) {
			console.log("Error parsing JSON string:", err);
		}
	});
});
