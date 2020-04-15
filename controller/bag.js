const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: process.env.DATABASE_URL,
  database: 'CYOA',
  password: 'postgres',
  port: 5432,
})

const getOneBag = (request, response) => {
  const characterId = parseInt(request.params.characterId)
  pool.query('SELECT * FROM "bag" WHERE "characterId" = $1', [characterId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addItemToBag = (request, response) => {
  const characterId = parseInt(request.params.characterId)
  const itemId = parseInt(request.params.itemId)

  pool.query('INSERT INTO "bag" ("characterId", "itemId") VALUES ($1, $2)', 
            [characterId, itemId], (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
    response.status(201).send(`Item ${itemId} added for character: ${characterId}`)
  })
}

const deleteItemFromBag = (request, response) => {
  const characterId = parseInt(request.params.characterId)
  const itemId = parseInt(request.params.itemId)

  pool.query('DELETE FROM "bag" WHERE "characterId" = $1 AND "itemId" = $2', 
            [characterId, itemId], (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
    response.status(201).send(`Item ${itemId} deleted from character ${characterId}`)
  })
}



module.exports = {
  getOneBag,
  addItemToBag,
  deleteItemFromBag
}