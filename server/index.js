const express = require('express')
const character = require('../controller/character')
const user = require('../controller/user')
const findUser = require('../controller/findUser')
const login = require('../controller/login')
const bag = require('../controller/bag')
const question = require('../controller/question')
const answer = require('../controller/answer')
const item = require('../controller/item')
const bodyParser = require('body-parser')

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

//Character endpoints
app.get('/character', character.getAllCharacters)
app.post('/character/user/:userId', bodyParser.json(), character.addNewCharacter)
app.put('/character/:characterId', bodyParser.json(), character.updateOneCharacter)
app.delete('/character/:characterId', character.deleteOneCharacter)
app.get('/character/:characterId', character.getOneCharacter)

//Login endpoints
app.post('/login', login.authenticate)

//User endpoints
app.get('/user', user.getAllUsers)
app.post('/user', user.addNewUser)
app.delete('/user/:userId', user.deleteOneUser)
app.put('/user/:userId', user.updateOneUser)

//Find User Endpoints
app.get('/user/:userId', findUser.findOneUser)

//Bag Endpoints
app.get('/bag/:characterId', bag.getOneBag)
app.post('/bag/:characterId/item/:itemId', bag.addItemToBag)
app.delete('/bag/:characterId/item/:itemId', bag.deleteItemFromBag)

//Question Endpoints
app.get('/question', question.getAllQuestions)
app.post('/question', question.addNewQuestion)
app.delete('/question/:questionId', question.deleteOneQuestion)
app.put('/question/:questionId', question.updateOneQuestion)

//Answer Endpoints
app.get('/answer', answer.getAllAnswers)
app.post('/answer/question/:questionId', answer.addNewAnswer)
app.delete('/answer/:answerId', answer.deleteAnswer)
app.put('/answer/:answerId', answer.updateOneAnswer)

//Item Endpoints
app.get('/item', item.getAllItems)
app.post('/item', item.addNewItem)
app.delete('/item/:itemId', item.deleteItem)
app.put('/item/:itemId', item.updateItem)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
