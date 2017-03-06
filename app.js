const http = require('http')
const path = require('path')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000;

(function () {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  // Create & configure a webpack compiler
  const webpack = require('webpack')
  const webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config')
  const compiler = webpack(webpackConfig)

  // Attach the dev middleware to the compiler & the server
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  // Attach the hot middleware to the compiler & the server
  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))
})()

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.use('/static', express.static('public'))

// PaintChat room

io.on('connection', function (socket) {
  socket.on('shape', function (shape) {
    socket.broadcast.emit('shape', shape)
  })

  socket.on('chat', function (message) {
    message.user = socket.id
    socket.broadcast.emit('chat', message)
  })

  socket.on('disconnect', function () {
    socket.broadcast.emit('user_left', {})
  })
})

server.listen(port, function () {
  console.log('Listening on %j', server.address())
})
