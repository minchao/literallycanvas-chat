var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

(function() {
    if (process.env.NODE_ENV != 'development') {
        return;
    }

    // Create & configure a webpack compiler
    var webpack = require('webpack');
    var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config');
    var compiler = webpack(webpackConfig);

    // Attach the dev middleware to the compiler & the server
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    // Attach the hot middleware to the compiler & the server
    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log,
        path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
})();

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('public'));

// PaintChat room

io.on('connection', function (socket) {
    socket.on('shape', function (shape) {
        socket.broadcast.emit('shape', shape);
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('user_left', {});
    });
});


server.listen(port, function() {
    console.log("Listening on %j", server.address());
});
