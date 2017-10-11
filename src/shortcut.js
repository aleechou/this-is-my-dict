const windowPos = require("./window-pos")
const objProxy = require("./misc/ObjectIpcProxy")
const $ = require("./lib/jquery")
const queryWord = require("./query-word")
const quickWindow = require("./quick")
const speaker = require("./speaker")

$input = $(".word-input")

// 全局快捷键
let shortcut = objProxy.fromMainProcess("shortcut")
let clipboard = objProxy.fromMainProcess("clipboard")
let self = objProxy.fromMainProcess("quick-window")


function registGlobalShutcut(keys, cb, cbSuc) {
    shortcut.on(keys, function() {
        cb && cb(keys)
    }, (suc) => {
        cbSuc && cbSuc(suc)
    })
}

// 显示/隐藏窗口
registGlobalShutcut('Shift+Space', () => {
    // self.isVisible((visible) => {
    //     if (visible) {
    //         self.hide()
    //     } else {

    //     }
    // })
    self.show()
    $input.focus()

    // 自动从剪切板中取英文单词
    clipboard.readText((text) => {
        if (!text) return
        if (!text.match(/^[a-zA-Z ]+$/)) return
        $input.val(text)
        $input.data("from-paste-board", true)
    })
})

// enter 所有
$input = $(".word-input").keypress(function(event) {
    if (event.keyCode != 13) return

    // 第一次按 enter: 查词
    if ($input.data("query-word") != $input.val()) {
        queryWord.queryWordFromInput()
        $input.data("from-paste-board", false)
    }
    // 多次按 enter: 读音
    else {
        speaker.speakWord('us')
    }
})

// Esc 关闭或取消
$(document).keydown(function(event) {
    if (event.keyCode != 27) return
    console.log(event.keyCode)

    // 取消从剪切板取来的词，还原原来输入的词
    if ($input.data("from-paste-board") && $input.val() != $input.data('query-word')) {
        $input.data("from-paste-board", false)
        $input.val($input.data('query-word'))
    }
    // 关闭 quick 窗口
    else {
        self.hide()
    }
})