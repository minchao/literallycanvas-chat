var http = require('http');
var express = require('express');

var app = express();

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

if (require.main === module) {
    var server = http.createServer(app);
    server.listen(process.env.PORT || 3000, function() {
        console.log("Listening on %j", server.address());
    });
}
