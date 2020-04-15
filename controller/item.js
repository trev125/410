const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: process.env.DATABASE_URL,
  database: 'CYOA',
  password: 'postgres',
  port: 5432,
})

const getAllItems = (request, response) => {
  pool.query('SELECT * FROM "item"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addNewItem = (request, response) => {
  const name = request.body[0].name
  const qst = request.body[0].question
  const str = request.body[0].strengthBuff
  const dex = request.body[0].dexBuff
  const spch = request.body[0].speechBuff
  const intel = request.body[0].intelBuff
  const key = request.body[0].key

  pool.query('INSERT INTO "item" ("name", "question", "strengthBuff", "dexterityBuff", "speechBuff", "intelligenceBuff", "key") VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [name, qst, str, dex, spch, intel, key], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`New item added!`)
  })
}

const deleteItem = (request, response) => {
  const itemId = parseInt(request.params.itemId)

  pool.query('DELETE FROM "item" WHERE "id" = $1', [itemId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Item deleted!`)
  })
}

const updateItem = (request, response) => {
  const itemId = parseInt(request.params.itemId)

  const name = request.body[0].name
  const qst = request.body[0].question
  const str = request.body[0].strengthBuff
  const dex = request.body[0].dexBuff
  const spch = request.body[0].speechBuff
  const intel = request.body[0].intelBuff
  const key = request.body[0].key

  pool.query('UPDATE "item" SET "name" = $1, "question" = $2, "strengthBuff" = $3, "dexterityBuff" = $4, "speechBuff" = $5, "intelligenceBuff" = $6, "key" = $7 WHERE "id" = $8', 
            [name, qst, str, dex, spch, intel, key, itemId], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`Item with ID of ${itemId} has been updated`)
  })
}


module.exports = {
  getAllItems,
  addNewItem,
  deleteItem,
  updateItem
}