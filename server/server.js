import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

const { readFile, writeFile, mkdir } = require('fs').promises
const { existsSync } = require('fs')

const Root = () => ''

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'StarNavi test task'
}).split('separator')

server.get('/api/v1/game-settings', (req, res) => {
  res.json({
    easyMode: { field: 5, delay: 2000 },
    normalMode: { field: 10, delay: 1000 },
    hardMode: { field: 15, delay: 900 }
  })
})

server.post('/api/v1/winners', (req, res) => {
  const filePath = path.join(__dirname, '..', 'winners', 'winners.json')
  const directoryPath = path.join(__dirname, '..', 'winners')
  if (!existsSync(directoryPath)) {
    mkdir(directoryPath)
  }
  readFile(filePath, { encoding: 'utf8' })
    .then((winners) => {
      const winnersArr = JSON.parse(winners)
      winnersArr.push(req.body)
      const text = JSON.stringify(winnersArr)
      writeFile(filePath, text, { encoding: 'utf8' })
      res.json(winnersArr)
    })
    .catch((er) => {
      console.log(er)
      writeFile(filePath, JSON.stringify([req.body]), { encoding: 'utf8' })
      res.json([req.body])
    })
})

server.get('/api/v1/winners', (req, res) => {
  const filePath = path.join(__dirname, '..', 'winners', 'winners.json')
  const directoryPath = path.join(__dirname, '..', 'winners')
  if (!existsSync(directoryPath)) {
    mkdir(directoryPath)
  }
  readFile(filePath, { encoding: 'utf8' })
    .then((winners) => {
      const winnersArr = JSON.parse(winners)
      res.json(winnersArr)
    })
    .catch(() => {
      res.json([])
    })
})

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

server.listen(port)

console.log(`Serving at http://localhost:${port}`)
