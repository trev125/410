var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'CYOA',
  password: 'postgres',
  port: 5432,
})

const findUser = require('./findUser')

const authenticate = (request, response) => {
  passport.use(new LocalStrategy(
    function(email, password, done) {
      findUser.findOneUser({ userEmail: email }, function(err, user) {
        console.log(request, response)
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
  console.log('hello Login')
}

module.exports = {
  authenticate
}


// app.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/users/' + req.user.username);
//   });