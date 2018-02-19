const qnode = require("qnode")

// var shortcut = new qnode.QtObjectWrapper("QHotkey*")
// console.log(shortcut.setShortcut("shift+space"))
// shortcut.setRegistered(true)
// console.log(shortcut.isRegistered(), shortcut.shortcut())
// shortcut.on("activated", function() {
//     console.log(this.shortcut())
// })

var mainWindow = new qnode.Window();
(async() => {

    await mainWindow.aload("file://" + __dirname + "/src/quick.html")

})()
mainWindow.show()

// 播放声音
var soundPlayer = new qnode.QtObjectWrapper("MediaPlayer*")
mainWindow.on("play-sound", (url) => {
    soundPlayer.setMedia(url)
    soundPlayer.play()
})

qnode.openDevConsole()