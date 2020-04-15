const character = require('../controller/character')
const user = require('../controller/user')
const findUser = require('../controller/findUser')
const login = require('../controller/login')
const bag = require('../controller/bag')
const question = require('../controller/question')
const answer = require('../controller/answer')
const item = require('../controller/item')
const bodyParser = require('body-parser')

const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

//Character endpoints
app.get('/character', character.getAllCharacters)
app.post('/character/user/:userId', bodyParser.json(), character.addNewCharacter)
app.put('/character/:characterId', bodyParser.json(), character.updateOneCharacter)
app.put('/character/:characterId/question/:questionId', character.updateOneCharacterCurrentQuestion)
app.delete('/character/:characterId', character.deleteOneCharacter)
app.get('/character/:characterId', character.getOneCharacter)

//Login endpoints
// app.post('/login', login.authenticate)

//User endpoints
app.get('/user', user.getAllUsers)
app.get('/user/:userId', user.getCurrentCharacterByUser)
app.put('/user/:userId/character/:characterId', user.addCharToUser)
app.post('/user', bodyParser.json(), user.addNewUser)
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
app.get('/question/:questionId', question.getOneQuestion)
app.put('/question/:questionId', question.updateOneQuestion)

//Answer Endpoints
app.get('/answer', answer.getAllAnswers)
app.get('/answer/:questionId', answer.getAllAnswersToQuestion)
app.post('/answer/question/:questionId', answer.addNewAnswer)
app.delete('/answer/:answerId', answer.deleteAnswer)
app.put('/answer/:answerId', answer.updateOneAnswer)

//Item Endpoints
app.get('/item', item.getAllItems)
app.get('/item/:questionId', item.getAllItemsForQuestion)
app.post('/item', item.addNewItem)
app.delete('/item/:itemId', item.deleteItem)
app.put('/item/:itemId', item.updateItem)



const cookieSession = require('cookie-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: process.env.DATABASE_URL,
  database: 'CYOA',
  password: 'postgres',
  port: 5432,
})


app.use(bodyParser.json())
app.use(cookieSession({
    name: 'mysession',
    keys: ['vueauthrandomkey'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours 
  }))

app.use(passport.initialize());
app.use(passport.session());

// let users = [
//     {
//         id: 1,
//         name: "Jude",
//         email: "user@email.com",
//         password: "password"
//     },
//     {
//         id: 2,
//         name: "Emma",
//         email: "emma@email.com",
//         password: "password2"
//     },
// ]

// app.get("/", (req, res, next) => {
//   res.sendFile("index.html", { root: publicRoot })
// })

app.post("/api/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            return res.status(400).send([user, "Cannot log in", info])
        }

        req.login(user, (err) => {
            res.send("Logged in")
        })
    })(req, res, next)
})

app.get('/api/logout', function(req, res){
    req.logout();
    console.log("logged out")
    return res.send();
});

// 

// app.get("/api/user", authMiddleware, (req, res) => {
//     let user = users.find((user) => {
//         return user.id === req.session.passport.user
//     })
//     console.log([user, req.session])
//     res.send({user: user})
// })

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
//   }, 
//   (username, password, done) => {
//     let user = users.find((user) => {
//       return user.email === username && user.password === password
//     })
    
//     if (user) {
//       done(null, user)
//     } else {
//       done(null, false, {message: 'Incorrect username or password'})
//     }
//   }
// ))

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
  }, 
  (username, password, done) => {
    let user = [];
    // let user = users.find((user) => {
    //   return user.email === username && user.password === password
    // })
    pool.query('SELECT * FROM "user" where email = $1 AND password = md5($2)', 
      [username, password], (error, results) => {
      if (error) {
        throw error;
      }
      else {
        user = results.rows;
        console.log(results.rows);
        console.log('you are logging in...', user)
        done(null, user);
      }
    })
    
    if (!user) {
      console.log('error!')
      done(null, false, {message: 'Incorrect username or password'})
    }
  }
))

passport.serializeUser((user, done) => {
  console.log('serialize', user)
  console.log('id', user[0].id)
  done(null, user[0].id)
})

passport.deserializeUser((id, done) => {
  let user = [];
  console.log('logging you out...', id);
  pool.query('SELECT * FROM "user" where id = $1', 
    [id], (error, results) => {
    if (error) {
      throw error;
    }
    else {
      user = results.rows;
      console.log(results.rows);
    }
  });
  console.log('you are logging out....', user)
  done(null, user);
})








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
