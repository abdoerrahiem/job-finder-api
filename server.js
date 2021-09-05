require('dotenv').config()
const express = require('express')
const cors = require('cors')
// const fs = require('fs')
const http = require('http')
const socketio = require('socket.io')
const { notFoundRoute, errorHandler } = require('./middlewares/errors')
const db = require('./utils/db')

db()

const app = express()
const server = http.createServer(app)
const io = socketio(server).sockets

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Welcome To Job Finder API'))

// fs.readdirSync('./app/routes').map((route) => {
//   route = route.split('.')[0]
//   return app.use(`/api/v1/${route}`, require(`./app/routes/${route}`))
// })

app.use('/users', require('./app/routes/users'))
app.use('/jobs', require('./app/routes/jobs'))
app.use('/applications', require('./app/routes/applications'))
app.use('/notifications', require('./app/routes/notifications'))
app.use('/conversations', require('./app/routes/conversations'))
app.use('/messages', require('./app/routes/messages'))

app.get('/payment/success', (req, res) => res.send())
app.post('/payment/success', (req, res) => res.send())
app.get('/payment/failed', (req, res) => res.send())
app.post('/payment/failed', (req, res) => res.send())

app.use(notFoundRoute)
app.use(errorHandler)

require('./middlewares/socket')(io)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
