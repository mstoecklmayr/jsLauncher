var nw = global.window.nwDispatcher.requireNwGui();
var fs = require('fs');
var q = require('q');
var action = require('./action.js');
var win = nw.Window.get();
win.isMaximized = false;
    
//nw.Window.get().showDevTools();

win.focus();
var path = require('path');
var execPath = path.dirname(process.execPath);
    
plugins = [];
keywords = {};

    
function can(obj, methodName, numOfParameters) {
    return ((typeof obj[methodName]) == "function" && obj[methodName].length == numOfParameters);
}
    
var pluginPath = execPath + "\\plugins";
    
q.nfcall(fs.readdir, pluginPath)
.then(function (dir) {
    dir.forEach(function (entry) {
        console.log(entry);
        var plugin = require(pluginPath + "\\" + entry);
        if (plugin != null && plugin != undefined) {
            if (can(plugin, "init", 0) && can(plugin, "execute", 2) && can(plugin, "search", 2)) {
                console.log(entry + " loaded");
                plugins.push(plugin);
                    
                if (plugin.words != undefined && plugin.words != null) {
                    var words = plugin.words;
                    words.forEach(function (entry) {
                        keywords[entry] = plugin.name;
                    });
                }
                
            } else {
                console.log(entry + " skipped!");
            }
        }
    });
})
.then(function (data) {
    window.$(function () {
        var result = window.$('#result');

        plugins.forEach(function (p) {
            result.append(p.name);
            console.log(p);
        });

        action.registerInputListener(window.document.getElementById("input"), 300);
        action.registerKeyPress();
    });    
})
.fail(function (err) {
        console.log(err);
        console.log('failure loading plugins!');
    })
.done();
    

    
//define global shortcut
var option = {
    key : "Ctrl+Shift+A",
    active : function () {
        console.log("Global desktop keyboard shortcut: " + this.key + " active.");
    },
    failed : function (msg) {
        // :(, fail to register the |key| or couldn't parse the |key|.
        console.log(msg);
    }
};
    
win.on('close', function () {
    nw.App.unregisterGlobalHotKey(shortcut);
    this.close(true);
}); 
    
// Create a shortcut with |option|.
var shortcut = new nw.Shortcut(option);
    
// Register global desktop shortcut, which can work without focus.
nw.App.registerGlobalHotKey(shortcut);
    
// If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
// will get an "active" event.
    
// You can also add listener to shortcut's active and failed event.
shortcut.on('active', function () {
    console.log("Global desktop keyboard shortcut: " + this.key + " active.");
    win.show();
    nw.Window.get().showDevTools();
    win.focus();
});
    
shortcut.on('failed', function (msg) {
    console.log(msg);
});