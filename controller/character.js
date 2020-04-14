const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',//change to db for docker
  database: 'CYOA',
  password: 'postgres',
  port: 5432,//change to 5432 for docker
})

const getAllCharacters = (request, response) => {
  pool.query('SELECT * FROM character', (error, results) => {
    if (error) {
      throw (error)
    }
    response.status(200).json(results.rows)
  })
}

const getOneCharacter  = (request, response) => {
  const characterId = parseInt(request.params.characterId)
  pool.query('SELECT * FROM character WHERE "id" = $1', [characterId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addNewCharacter = (request, response) => {
  console.log(request.body);
  const userId = parseInt(request.params.userId)
  const name = request.body.name
  const dex = request.body.dexterity
  const spch = request.body.speech
  const intel = request.body.intelligence
  const str = request.body.strength

  pool.query('INSERT INTO character ("userId", "name", "dexterity", "speech", "intelligence", "strength") VALUES ($1, $2, $3, $4, $5, $6)', 
            [userId, name, dex, spch, intel, str], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`Character added to user with ID: ${userId}`)
  })
}

const updateOneCharacter = (request, response) => {
  const characterId = parseInt(request.params.characterId)

  //get the update data
  const name = request.body[0].name
  const dex = request.body[0].dexterity
  const spch = request.body[0].speech
  const intel = request.body[0].intelligence
  const str = request.body[0].strength

  pool.query('UPDATE character SET "name" = $1, "dexterity" = $2, "speech" = $3, "intelligence" = $4, "strength" = $5 WHERE "id" = $6', 
            [name, dex, spch, intel, str, characterId], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`Character updated with character ID: ${characterId}`)
  })
}

const deleteOneCharacter = (request, response) => {
  const characterId = parseInt(request.params.characterId)

  pool.query('DELETE FROM character WHERE "id" = $1', [characterId], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`Character deleted with character ID: ${characterId}`)
  })
}


module.exports = {
  getAllCharacters,
  addNewCharacter,
  updateOneCharacter,
  deleteOneCharacter,
  getOneCharacter
}


// ERROR:  column "userid" of relation "character" does not exist at character 24
// db_1       | 2020-03-03 00:06:43.326 UTC [35] STATEMENT:  INSERT INTO character (userId, name, dexterity, speech, intelligence, strength) VALUES ($1, $2, $3, $4, $5, $6)