var co = require('co');
var ResultRow = require('./resultRow.js');

module.exports.registerInputListener = function registerInputListener(input, delay) {
    var result = window.$('#result');
    console.log("asdfa");
    var timer = null;
    input.onkeypress = function (e) {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(function () {
            timer = null;
            if (e.which != 13)
                pluginSearch();
        }, delay);
    };
};

module.exports.registerKeyPress = function registerKeyPress() {
    var input = window.$("#input");
    input.keypress(function (e) {
        if (e.which == 13) {
            
            // Reference to window and tray;
            var nw = global.window.nwDispatcher.requireNwGui();
            var win = nw.Window.get()
            var tray;
            
            win.setShowInTaskbar(true);
            // Get the minimize event
            win.on('minimize', function () {
                // Hide window
                this.hide();
                
                // Show tray
                tray = new nw.Tray({ icon: './icon.png' });
                
                // Show window and remove tray when clicked
                tray.on('click', function () {
                    win.show();
                    this.remove();
                    tray = null;
                });
            });
            /*
             *  Check keywords for correct plugin
             * 
             */

            //plugins.forEach(function (plugin) {
            var res = plugins[0].execute('', input.val());
            //});
            var new_win = nw.Shell.openExternal('https://github.com/rogerwang/node-webkit');
            new_win.focus();
        }
    });
};

var pluginSearch = function () {
    var input = window.$('#input');
    var result = window.$('#result');
    result.empty();
    co(function*() {
        
        var rest = yield plugins[0].search('', input.val());
        
        //var rest = [];
        //rest.push({ url: "1", title: "Title1" });
        //rest.push({ url: "2", title: "Title2" });
        //rest.push({ url: "3", title: "Title3" });
        //rest.push({ url: "4", title: "Title4" });
        //rest.push({ url: "5", title: "Long tiiiiiiiiiiiiiiiiiiitl" });
        
        if (rest != null && rest != undefined) {
            rest.forEach(function (row) {
                result.append('<li class="item"><a onclick="link(' + row.link + ')">' + row.title + '</a></li>');
            });
        }
        link();
    })
    .catch(function (err) {
        console.log(err);
    });
    
    /*
    *  Check keywords for correct plugin
    * 
    */  
};

function link(link) {
    console.log(link);
}