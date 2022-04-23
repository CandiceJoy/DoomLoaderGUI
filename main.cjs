// main.cjs
// Modules to control application life and create native browser window
const {
	      app,
	      BrowserWindow
      } = require('electron');
const path = require('path');

function windowOptions(title)
{
	return {
		width         : 800,
		height        : 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.cjs'),
			nodeIntegration: true,
			contextIsolation: false
		},
		title:title
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() =>
                     {
	                     const mainWindow = new BrowserWindow(windowOptions("DoomLoader"));
	                     mainWindow.loadFile("index.html");

	                     app.on('activate', () =>
	                     {
		                     // On macOS it's common to re-create a window in the app when the
		                     // dock icon is clicked and there are no other windows open.
		                     if(BrowserWindow.getAllWindows().length === 0)
		                     {
			                     const mainWindow2 = new BrowserWindow(windowOptions("DoomLoader"));
			                     mainWindow2.loadFile("index.html");
		                     }
	                     });
                     });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () =>
{
	if(process.platform !== 'darwin')
	{
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
