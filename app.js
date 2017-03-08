const http = require('http')
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000
const uuid = require('uuid')
const appName = 'PaintChat'
const tempFile = 'temp.json';

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

let users = []
let shapes = []

function saveShapesToFile () {
  fs.writeFile(tempFile, JSON.stringify(shapes), 'utf8')
}

function loadShapesFromFile () {
  fs.readFile(tempFile, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      shapes = JSON.parse(data)
    }
  })
}

loadShapesFromFile()

io.on('connection', function (socket) {
  // client init
  socket.on('init', function (data) {
    users.push({
      id: socket.id,
      name: data.user
    })
    io.emit('chat', {
      id: uuid.v4(),
      user: appName,
      text: data.user + ' enters the chat room'
    })

    // sync shapes history
    shapes.map((shape) => {
      socket.emit('shape', shape)
    })
  })

  socket.on('shape', function (shape) {
    shapes.push(shape)
    socket.broadcast.emit('shape', shape)
  })

  socket.on('chat', function (message) {
    switch (message.text) {
      case '!save':
        saveShapesToFile()
        break
      case '!load':
        loadShapesFromFile()
        break
      default:
        socket.broadcast.emit('chat', message)
    }
  })

  socket.on('disconnect', function () {
    let i = users.findIndex((user) => {
      return user.id === socket.id
    })
    if (i >= 0) {
      let user = users[i]
      users.splice(i, 1)
      socket.broadcast.emit('chat', {
        id: uuid.v4(),
        user: appName,
        text: user.name + ' left the room'
      })
    }
  })
})

server.listen(port, function () {
  console.log('Listening on %j', server.address())
})
