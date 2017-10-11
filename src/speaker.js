const $ = require("./lib/jquery")



// var soundQueue = []

// var nextSoundWaitTimer = null
// const nextSoundWaitMSec = 500

$speaker = $(".word-speaker")


// $speaker[0].onended = function() {
//     if (!soundQueue.length) {
//         return
//     }
//     nextSoundWaitTimer = setTimeout(() => {
//         playNextSound()
//         if (nextSoundWaitTimer != null) {
//             nextSoundWaitTimer = null
//         }
//     }, nextSoundWaitMSec)
// }

// function playNextSound() {
//     var sound = soundQueue.shift()
//     if (!sound) return
//     exports.speakUri(sound)
// }


var speakCallback = null

exports.abord = function() {
    // if (nextSoundWaitTimer != null) {
    //     clearTimeout(nextSoundWaitTimer)
    //     nextSoundWaitTimer = null
    // }
    // soundQueue = []
    // $speaker[0].stop()
    if (speakCallback) {
        ((speakCallback) => {
            speakCallback(null, true)
        })(speakCallback)
        speakCallback = null
    }
}


exports.speakWord = function(lang, cb) {
    var $speaker = $(".phonetic-lang." + lang + " .speaker")
    var localUri = $speaker.data("localUri")
    if (!localUri) {
        console.log("video file not loaded yet")
        return
    }
    exports.speakUri(localUri, cb)
}

exports.speakWordSeveralTimes = function(lang, times, cb) {
    if (times < 1) {
        cb && cb()
        return
    }
    this.speakWord(lang, (error, abort) => {
        if (abort) {
            cb && cb()
            return
        }
        this.speakWordSeveralTimes(lang, times - 1, cb)
    })
}

exports.speakUri = function(uri, cb) {
    exports.abord()

    speakCallback = cb

    $speaker.attr('src', uri)
    $speaker[0].play()
}

console.log($speaker[0])
$speaker[0].onended = function() {
    if (speakCallback) {
        ((speakCallback) =>
            setTimeout(() => speakCallback(null, false), 0)
        )(speakCallback)
        speakCallback = null;
    }
}