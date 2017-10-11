let electron = require("electron")


var signedInvorkId = 0
var pendingInvorks = {}

var signedEventHandleId = 0
var remoteEventHandles = {}

if (electron.ipcRenderer) {

    let ipc = electron.ipcRenderer

    exports.fromMainProcess = function(objectName) {
        var target = {
            objectName: objectName,
            "on": function(eventName, cb, cbSuc) {
                var handleId = signedEventHandleId++;
                remoteEventHandles[handleId] = cb

                if (cbSuc) {
                    var invorkId = signedInvorkId++;
                    pendingInvorks[invorkId] = cbSuc
                }

                ipc.send('object-ipc-proxy:on', objectName, eventName, handleId, invorkId)

            }
        }
        return new Proxy(target, {
            get: function(target, funcName) {
                return (funcName in target) ?
                    target[funcName] :
                    function() {
                        var invorkId = signedInvorkId++;
                        callback = arguments[arguments.length - 1]
                        if (typeof(callback) == "function") {
                            args = Array.prototype.slice.apply(arguments, [0, arguments.length - 1])
                            pendingInvorks[invorkId] = callback
                        } else {
                            args = Array.prototype.slice.apply(arguments, [0, arguments.length])
                            callback = null
                        }
                        ipc.send('object-ipc-proxy:invork', objectName, funcName, args, invorkId, !!callback)
                    }
            }
        })
    }

    ipc.on("object-ipc-proxy:return", function(event, invorkId, value) {
        if (!pendingInvorks[invorkId]) {
            console.error("unknow invork id of ipc invork return from main process", invorkId)
            return
        }
        pendingInvorks[invorkId].apply(null, [value])
        delete pendingInvorks[invorkId]
    })

    ipc.on("object-ipc-proxy:emit", function(event, handleId, args) {
        if (!remoteEventHandles[handleId]) {
            console.error(`unknow event handle id (${handleId}) of ipc event from main process`)
            return
        }
        remoteEventHandles[handleId].apply(null, args)
    })

} else {
    let ipc = electron.ipcMain

    var proxyObjects = {}

    exports.exportAsRemoteObject = function(name, object) {
        proxyObjects[name] = object
    }

    ipc.on("object-ipc-proxy:invork", function(event, objectName, funcName, args, invorkId, ret) {
        if (!proxyObjects[objectName]) {
            console.error(`unknow ipc proxy object name from renderer: ${objectName}`)
            return
        }
        if (!(funcName in proxyObjects[objectName])) {
            console.error(`unknow function(or property) name($(funcName)) of object ${objectName}`)
            return
        }

        if (typeof(proxyObjects[objectName][funcName]) == "function") {
            var value = proxyObjects[objectName][funcName].apply(proxyObjects[objectName], args)
            if (ret)
                event.sender.send('object-ipc-proxy:return', invorkId, value)
        }

    })

    ipc.on('object-ipc-proxy:on', function(event, objectName, eventName, handleId, invorkId) {
        if (!proxyObjects[objectName]) {
            console.error(`unknow ipc proxy object name from renderer: ${objectName}`)
            return
        }
        var suc = proxyObjects[objectName].on(eventName, function() {
            event.sender.send("object-ipc-proxy:emit", handleId, arguments)
        })

        if (invorkId != undefined) {
            event.sender.send('object-ipc-proxy:return', invorkId, suc)
        }
    })
}