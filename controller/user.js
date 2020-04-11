const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'CYOA',
  password: 'postgres',
  port: 5432,
})

const getAllUsers = (request, response) => {
  pool.query('SELECT * FROM "user"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const addNewUser = (request, response) => {
  const email = request.body[0].email
  const password = request.body[0].password
  const name = request.body[0].name
  const characterID = request.body[0].characterID

  pool.query('INSERT INTO "user" ("email", "password", "name", "characterID") VALUES ($1, md5($2), $3, $4)', 
            [email, password, name, characterID], (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
    response.status(201).send(`User added with the ID of: _______`)
  })
}

const deleteOneUser = (request, response) => {
  const userId = parseInt(request.params.userId)
  pool.query('DELETE FROM "user" WHERE "id" = $1', [userId], (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`User deleted with UserID: ${userId}`)
  })
}


const updateOneUser = (request, response) => {
  const userId = parseInt(request.params.userId)

  //get the update data
  const email = request.body[0].email
  const password = request.body[0].password
  const name = request.body[0].name
  const characterID = request.body[0].characterID

  pool.query('UPDATE "user" SET "email" = $1, "password" = md5($2), "name" = $3, "characterID" = $4 WHERE "id" = $5', 
            [email, password, name, characterID, userId], (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`User updated with UserID: ${userId}`)
  })
}

module.exports = {
  getAllUsers,
  addNewUser,
  deleteOneUser,
  updateOneUser
}