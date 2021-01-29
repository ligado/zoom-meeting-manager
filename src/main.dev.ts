/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import path from 'path'
import { app, BrowserWindow, Menu, nativeImage, screen, shell, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import registerHandlers from './electron/registerHandlers'
import BrowserWindowService, { EventType } from './electron/service/BrowserWindowService'

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')()
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log)
}

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions()
  }

  // const RESOURCES_PATH = app.isPackaged
  //   ? path.join(process.resourcesPath, 'resources')
  //   : path.join(__dirname, '../resources')

  // Note: I had to fix this to match what I observed in the dev and in the prod deployments
  const RESOURCES_PATH = app.isPackaged
    // ? path.join(process.resourcesPath, 'resources/assets')
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  // Determine the position and size of the window
  const primaryDisplay = screen.getPrimaryDisplay()
  const screenBounds = primaryDisplay.bounds
  const appWidth = Math.max(screenBounds.width * 0.2, 512)
  const appHeight = screenBounds.height - 32

  // Create the browser window, with the position and size based on screen size
  mainWindow = new BrowserWindow({
    show: false,
    titleBarStyle: 'hidden',
    x: screenBounds.width - appWidth,
    y: 0,
    width: appWidth,
    height: appHeight,
    frame: false,
    // Do not show the window in the taskbar
    skipTaskbar: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
      enableRemoteModule: true
    }
  })


  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater()

  // Initialize our BrowserWindowService
  const browserWindowService = BrowserWindowService.getInstance()
  browserWindowService.setBrowserWindow(mainWindow)

  // Create Tray
  const iconPath = getAssetPath('icon.png')
  console.log(`Icon path: ${iconPath}`)
  tray = new Tray(nativeImage.createFromPath(iconPath))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
        }
      }
    },
    {
      label: 'Exit',
      click: () => {
        if (mainWindow) mainWindow.destroy()
      }
    }
  ])
  tray.setToolTip('Zoom Meeting Manager')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    browserWindowService.event(EventType.TRAY_CLICK)
  })

  /**
   * Hide the main window on close, closing will be done through the task icon's exit menu
   */
  mainWindow.on('close', (event) => {
    // Stop the window from closing
    event.preventDefault()
    if (mainWindow) {
      // Hide the window
      mainWindow.hide()
    }
  })

  // If the user clicks away from the window, we want to hide it
  mainWindow.on('blur', () => {
    browserWindowService.event(EventType.BLUR)
  })
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(createWindow).catch(console.log)

// Hide the electron app from the dock
app.on('ready', () => {
  if (app.dock) app.dock.hide()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// Register all of our event handlers
registerHandlers()
