const qnode = require("qnode")


var mainWindow = new qnode.Window();
(async() => {

    await mainWindow.aload("file://"+__dirname + "/src/quick.html")
    
})()
mainWindow.show()

// 播放声音
var soundPlayer = new qnode.QtObjectWrapper("MediaPlayer*")
mainWindow.on("play-sound", (url)=>{
    soundPlayer.setMedia(url)
    soundPlayer.play()
})

qnode.openDevConsole()