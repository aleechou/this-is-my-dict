const { app, BrowserWindow, ipcMain, globalShortcut, clipboard } = require('electron')
const path = require('path')
const url = require('url')
const objProxy = require("./src/misc/ObjectIpcProxy.js")

let quick

// console.log(__dirname)

function createWindow() {
    quick = new BrowserWindow({ width: 400, height: 250, frame: false })

    objProxy.exportAsRemoteObject("quick-window", quick)
    objProxy.exportAsRemoteObject("shortcut", globalShortcut)
    objProxy.exportAsRemoteObject("clipboard", clipboard)

    globalShortcut.on = globalShortcut.register
    globalShortcut.on = function(n, e) {
        return this.register(n, e)
    }

    quick.loadURL("file://" + __dirname + '/src/quick.html')
    quick.webContents.openDevTools()
    quick.on('closed', () => {
        quick = null
    })
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (quick === null) {
        createWindow()
    }
})