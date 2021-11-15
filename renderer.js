const { ipcRenderer } = require("electron");

const settingsBtn = document.getElementById("set-btn");

settingsBtn.addEventListener("click", () => {
	ipcRenderer.invoke("read-user-data").then((result) => {
		console.log(result);

		configs = JSON.parse(result);

		const body = document.querySelector('body');

    body.style.backgroundColor = '#123'
	});
});

ipcRenderer.on("message", (param1) => {
	console.log(param1);
});
