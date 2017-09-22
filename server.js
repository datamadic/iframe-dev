const liveServer = require('live-server');
const openfinConfigBuilder = require('openfin-config-builder');
const openfinLauncher = require('openfin-launcher');
const path = require('path');

let target;
const configPath = path.resolve('public/app.json');
const serverParams = {
    root: path.resolve('public'),
    open: false,
    logLevel: 2,
    port: 55555
};

//Update our config and launch openfin.
function launchOpenFin() {
    openfinConfigBuilder.update({
        startup_app: {
            url: target + '/index.html',
            applicationIcon: target + '/favicon.ico',
            saveWindowState: true,
            defaultTop: 0,
            defaultLeft: 0,
            contextMenu: true,
            _maxHeight: 500
        },
        runtime: {
            arguments: '--remote-debugging-port=9090 --v=1 --enable-logging --debug=5858 --diagnostics --enable-crash-reporting --enable-multi-runtime',
            version: '6.49.21.*',
            version__: '7.53.23.8',
	    version__: 'alpha',
            __version: '7.53.23.3',
            ___version: '8.56.23.8'
        },
        shortcut: {
            icon: target + '/favicon.ico'
        }
    }, configPath)
        .then(openfinLauncher.launchOpenFin({ configPath: configPath }))
        .catch(err => console.log(err));
}


//Start the server server and launch our app.
liveServer.start(serverParams).on('listening', () => {
    const { address, port } = liveServer.server.address();
    target = `http://localhost:${port}`;
    launchOpenFin();
});

// var a = new fin.desktop.Window({url: 'https://google.com', name: 'asdf', autoShow: true})
// var app = new fin.desktop.Application({url: location.href, uuid: 'asdf', name: 'asdf', autoShow: true}, () => app.run())
