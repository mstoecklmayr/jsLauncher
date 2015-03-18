﻿// Min
document.getElementById('windowControlMinimize').onclick = function () {
    win.minimize();
};

// Close
document.getElementById('windowControlClose').onclick = function () {
    win.close();
};

// Max
document.getElementById('windowControlMaximize').onclick = function () {
    if (win.isMaximized)
        win.unmaximize();
    else
        win.maximize();
};

win.on('maximize', function () {
    win.isMaximized = true;
});

win.on('unmaximize', function () {
    win.isMaximized = false;
});