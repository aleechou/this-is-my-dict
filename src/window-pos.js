let data = require("./savedata")
const { screen, ipcRenderer } = require("electron")
const idle = require("./misc/idle")
let self = require("./misc/ObjectIpcProxy").fromMainProcess("quick-window")

exports.init = function() {
    // 窗口置顶
    self.setAlwaysOnTop(true);

    // 移动后保存所在屏幕
    self.on('move', function() {
        saveWindowScreen()
    })
    let saveWindowScreen = idle(() => {
        self.getContentBounds((bound) => {
            var display = screen.getDisplayMatching(bound)
            data["quick-display-id"] = display.id
            data.save()
        })
    })

    // 窗口移动到屏幕角落
    moveToScreenCorner()
}

function findDisplayById(id) {
    for (display of screen.getAllDisplays()) {
        if (display.id == id)
            return display
    }
}
exports.findDisplayById = findDisplayById


// 初始位置
exports.moveToScreenCorner = function moveToScreenCorner(cb) {
    self.getSize((size) => {
        var display = findDisplayById(data["quick-display-id"]) || screen.getPrimaryDisplay()
        var x = display.workAreaSize.width - size[0]
        var y = display.workAreaSize.height - size[1]
        self.setPosition(display.workArea.x + x, display.workArea.y + y, cb)
    })
}

exports.moveToCurrentScreen = function() {
    console.log(screen.getAllDisplays())
}