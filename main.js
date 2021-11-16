// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");
const { ChildProcess } = require("child_process");

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		frame: false,
		width: 400,
		height: 300,
		minHeight: 20,
		minWidth: 200,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
		alwaysOnTop: true,
		autoHideMenuBar: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	settingWindow = new BrowserWindow({
		parent: mainWindow,
		width: 650,
		height: 350,
		minHeight: 20,
		minWidth: 200,
		autoHideMenuBar: true,
		maximizable:false,
		minimizable: false,
		show: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
		alwaysOnTop: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile("index.html");

	settingWindow.loadFile("settings.html");

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
	settingWindow.webContents.openDevTools();

	settingWindow.on("close", function (evt) {
		evt.preventDefault();
		settingWindow.hide();
	});

	settingWindow.on('show', () => {
		settingWindow.webContents.send('get-config-data')
	})

	ipcMain.on("show-settings", () => {
		settingWindow.show();
	});

	ipcMain.on("hide-settings", () => {
		settingWindow.hide();
	});

	ipcMain.on("configs:change-color", (event, colorConfigs) => {
		mainWindow.webContents.send("configs:change-color", colorConfigs);
	});

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	const menuTemplate = [
		// { role: 'fileMenu' }
		{
			label: "File",
			submenu: [{ role: "quit" }],
		},
		,
		// { role: 'editMenu' }
		/* 		{
			label: "Edit",
			submenu: [
				{
					label: "Hide Logo",
					async click() {
					},
				},
			],
		} */ // { role: 'viewMenu' }
		{
			label: "View",
			submenu: [{ role: "reload" }, { role: "forceReload" }],
		},
		// { role: 'windowMenu' }
		{
			label: "Window",
			submenu: [{ role: "minimize" }],
		},
	];

	const appMenu = Menu.buildFromTemplate(menuTemplate);

	Menu.setApplicationMenu(appMenu);

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("read-config-data", () => {
	return fs.readFileSync("utils/config.json", (err, jsonString) => {
		if (err) {
			console.log("Error reading file from disk:", err);
			return;
		}
		try {
			const customer = JSON.parse(jsonString);
			return jsonString;
		} catch (err) {
			console.log("Error parsing JSON string:", err);
		}
	});
});
