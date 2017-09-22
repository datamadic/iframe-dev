//event listeners.
document.addEventListener('DOMContentLoaded', () => {

    if (typeof fin != 'undefined') {
        fin.desktop.main(onMain);
    } else {
        ofVersion.innerText = 'OpenFin is not available - you are probably running in a browser.';
    }
});


//setInterval(() => {
//    console.log('live from the renderer');
//}, 3000);

//setInterval(() => {
//    fin.desktop.Window.getCurrent().moveBy(1,1);
//}, 200);

function vl () {
	fin.desktop.System.setMinLogLevel(fin.desktop.System.logLevels.VERBOSE);
}
function af () {
    iframe = document.createElement('iframe');
    iframe.src = location.origin + '/app.json';
    document.body.appendChild(iframe);
}
//Once the DOM has loaded and the OpenFin API is ready
function onMain() {
    // fin.desktop.Window.getCurrent().moveTo(0,0);

    fin.desktop.System.getVersion(version => {
        const ofVersion = document.querySelector('#of-version');
        ofVersion.innerText = version;
    });

    // fin.desktop.Window.wrap('OpenfinPOC', 'asdf').addEventListener('shown', ()=>{debugger});
    // fin.desktop.Window.wrap('OpenfinPOC', 'asdf').addEventListener('on-window-unload', ()=>{debugger});
    // fin.desktop.Window.wrap('OpenfinPOC', 'asdf').addEventListener('openfin-diagnostic/unload', ()=>{debugger});

    fin.desktop.Window.wrap('OpenfinPOC', 'asdf').addEventListener('window-unload', ()=>{debugger});
    fin.desktop.Window.wrap('OpenfinPOC', 'asdf').addEventListener('unload', ()=>{debugger});

    // var b = new fin.desktop.Window({url: location.href, name: 'asdf', autoShow: true}, () => {});

    // var a = new fin.desktop.Window({url: 'https://google.com', name: 'asdf', autoShow: true}, () => {
    //     // a.close(()=>{
    //     //     fin.desktop.Window.getCurrent().close();
    //     // })
    //     alert('asdf');
    //     a.executeJavaScript('location.href="http://bing.com"', () => console.log('BINGED!'));
    // })
}

var win;

function makewindow() {
    win = new fin.desktop.Window({url: location.href, name: 'asdf', autoShow: true}, () => {});
}

var frame = true;
var contextMenu = true;

function tops () {
	frame = !frame;
	contectMenu = !contextMenu;

	return {frame,contectMenu}
}

function toggopts () {
	win.updateOptions(tops())
}

function cr () {
    fin.desktop.System.startCrashReporter(a => console.log(a))
}

function nw () {
    win = new fin.desktop.Window({name: 'child', autoShow: true, url: location.href})
}

function cl () {
    var w = new fin.desktop.Window({name: 'cors', autoShow: true, url: 'https://google.com'})
}

function na () {
    app = new fin.desktop.Application({url: location.href, uuid: 'app2', autoShow: true, name: 'app2'}, function(){
        app.run();
    });
}

var stuffInt = -1;
me = fin.desktop.Window.getCurrent();
function dostuff () {
    if (stuffInt === -1) {
        stuffInt = setInterval(function(){
            me.moveBy(1,1);
        }, 1000);
    } else {
        clearInterval(stuffInt);
        stuffInt = -1;
    }
} 


function devtools() {
    fin.desktop.System.showDeveloperTools('OpenfinPOC', 'OpenfinPOC')
}

function crash() {
    var a = [];
    setTimeout(() => {
        while (1) { a.push(Math.random()); }
    }, 20);
}

function onNotificationMessage(message) {

    console.log('got', message);

}




function test (completionCallback) {
    function getMemory(list, uuid) {
        var found;

        list.forEach(function (item) {
            if (item.uuid === uuid) {
                found = item.workingSetSize;
            }
        });

        if (!found) found = 0;

        return found;
    }



    var memPromise = function () {
        return new Promise(function (resolve, reject) {
            fin.desktop.System.getProcessList(function (list) {
                var mem = getMemory(list, 'OpenfinPOC');

                resolve(mem);
            }, reject);
        });
    };


    var create = function (until, action, err, winds) {

        if (!winds) {
            winds = [];
        }

        if (!until) {
            action(winds);
            return;
        }

        var createdWind = new fin.desktop.Window({
            "name": Math.random() + 'ohhh-yeah',
            "autoShow": true,
            "url": 'about:blank',
        }, function () {
            winds.push(createdWind);
            create((Math.max(0, --until)), action, err, winds);
        }, err);

    };


    var close = function (winds, action, err) {

        if (!winds.length) {
            return action();
        }

        winds[0].close(true, function () {
            winds.shift()
            close(winds, action, err);
        }, err)
    }

    var closePromise = function (winds) {
        return new Promise(function (resolve, reject) {
            close(winds, resolve, reject);
        });
    }


    var createPromise = function (wnds) {
        return new Promise(function (resolve, reject) {
            create(wnds, resolve, reject);
        });
    };

    var memLog = [],
        approxWindRetainedSize = 272784,
        createdWindows;

    memPromise().then(function (mem) {
        memLog.push(mem);

        return createPromise(20);
    })
        .then(function (winds) {
            createdWindows = winds;

            return memPromise()
        })
        .then(function (mem) {
            memLog.push(mem);

            return closePromise(createdWindows)
        })
        .then(function () {
            return memPromise()
        })
        .then(function (mem) {
            memLog.push(mem);

            updateTest({ data: { memoryLog: memLog } });

            memLog.forEach(function (item, index) {
                // console.log(index + ': ' + utils.bytesToSize(item));
            });

            completionCallback(true);

        })
        .catch(function () {
            completionCallback(false);
        });
}


