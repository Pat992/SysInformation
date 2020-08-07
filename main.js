const path = require('path')
const url = require('url')
const { app, BrowserWindow, Tray, Menu, screen, ipcMain } = require('electron')
const { getStaticInfos } = require('./getInformations/getStaticInformations')
const getDynamicDashboard = require('./getInformations/getDynamicInformation')
const Store = require('./store/store');
const { parseBooleans } = require('xml2js/lib/processors')
const { electron } = require('process')

let mainWindow
let tray

// Init store
const store = new Store('sysInfoSettings')
// get settings
let storeSettinsgs = store.get('settings')

let isDev = false

if (
	process.env.NODE_ENV !== undefined &&
	process.env.NODE_ENV === 'development'
) {
	isDev = true
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: 'SysInfo',
		width: isDev ? 570 : 400,
		height: 600,
		movable: isDev ? true : false,
		show: false,
		frame: false,
		alwaysOnTop: storeSettinsgs.settings.alwaysOnTop,
		opacity: storeSettinsgs.settings.opacity,
		skipTaskbar: true,
		resizable: isDev ? true : false,
		backgroundColor: 'white',
		icon: `${__dirname}/assets/icons/icon.png`,
		webPreferences: {
			nodeIntegration: true,
		},
	})

	setWindowBounds()
	setWindowBounds()

	let indexPath

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		})
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		})
	}

	mainWindow.loadURL(indexPath)

	// Don't show until we are ready and loaded
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()

		// Open devtools if dev
		if (isDev) {
			const {
				default: installExtension,
				REACT_DEVELOPER_TOOLS,
			} = require('electron-devtools-installer')

			installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
				console.log('Error loading React DevTools: ', err)
			)
			mainWindow.webContents.openDevTools()
		}
	})

	mainWindow.on('closed', () => (mainWindow = null))
}

function createTray() {
	// Create Tray
	tray = new Tray(`${__dirname}/assets/icons/windows-icon@2x.png`)
	// set Titel
	tray.setToolTip('SysInfo')

	// Toggle hide
	tray.on('click', (e) => {
		if (mainWindow.isVisible()) {
			mainWindow.hide()
		} else {
			mainWindow.show()
		}
	})

	tray.on('right-click', () => {
		// create close-menu
		const template = [{ role: 'quit' }]
		const menu = Menu.buildFromTemplate(template)
		tray.popUpContextMenu(menu)
	})
}

function setWindowBounds(choosenScreen = storeSettinsgs.settings.screen) {
	// Set mainWindow on top-right
	const { width: windowWidth, height: windowHeight } = mainWindow.getBounds();

	let window = screen.getPrimaryDisplay()
	if (storeSettinsgs && storeSettinsgs.windows === screen.getAllDisplays().length) {
		let tempWd = screen.getAllDisplays();
		window = tempWd[choosenScreen];
	}
	mainWindow.setBounds({
		x: window.workArea.x + (window.workArea.width - windowWidth),
		y: window.workArea.y,
		width: windowWidth,
		height: windowHeight
	})
}

app.on('ready', () => {
	createMainWindow()
	createTray()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow()
	}
})

// IPC-Calls
ipcMain.on('infos:getStatic', async () => {
	let infos = await getStaticInfos()
	mainWindow.webContents.send('infos:receiveStatic', infos)
})

ipcMain.on('infos:getDynamicDashboard', async () => {
	let infos = await getDynamicDashboard()
	mainWindow.webContents.send('infos:receiveDynamicDashboard', infos)
})

ipcMain.on('settings:get', () => {
	mainWindow.webContents.send('settings:receive', { ...store.get('settings'), 'windows': screen.getAllDisplays().length })
})

ipcMain.on('settings:save', (sender, data) => {
	store.set('settings', data)
	mainWindow.setOpacity(parseFloat(data.settings.opacity))
	mainWindow.isAlwaysOnTop(parseBooleans(data.settings.isAlwaysOnTop))
	setWindowBounds(data.settings.screen)
	setWindowBounds(data.settings.screen)
})

// Stop error
app.allowRendererProcessReuse = true
