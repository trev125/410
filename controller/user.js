const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: process.env.DATABASE_URL,
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

const getCurrentCharacterByUser = (request, response) => {
  const userId = parseInt(request.params.userId)
  pool.query('SELECT * FROM "character" where id = (SELECT "characterID" from "user" where id = $1)',
    [userId], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const addCharToUser = (request, response) => {
  const userId = parseInt(request.params.userId)
  const charId = parseInt(request.params.characterId)
  pool.query('UPDATE "user" SET "characterID" = $1 WHERE "id" = $2', 
    [charId, userId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User ${userId} updated with character ID: ${charId}`)
  })
}


const addNewUser = (request, response) => {
  //console.log(request)
  console.log(request.body)
  const email = request.body.email
  const password = request.body.password
  const name = request.body.name
  //const characterID = request.body[0].characterID

  pool.query('INSERT INTO "user" ("email", "password", "name") VALUES ($1, md5($2), $3)', 
            [email, password, name], (error, results) => {
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
  getCurrentCharacterByUser,
  addCharToUser,
  addNewUser,
  deleteOneUser,
  updateOneUser
}