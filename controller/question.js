const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'CYOA',
  password: 'postgres',
  port: 5432,
})

const getAllQuestions = (request, response) => {
  pool.query('SELECT * FROM question', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addNewQuestion = (request, response) => {
  const questionText = request.body[0].questionText

  pool.query('INSERT INTO "question" ("questionText") VALUES ($1)', 
            [questionText], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`Question added!`)
  })
}

const deleteOneQuestion = (request, response) => {
  const questionId = parseInt(request.params.questionId)

  pool.query('DELETE FROM "question" WHERE "id" = $1)', 
            [questionId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Question with ID of ${questionId} has been deleted`)
  })
}

const updateOneQuestion = (request, response) => {
  const questionId = parseInt(request.params.questionId)
  const questionText = request.body[0].questionText

  pool.query('UPDATE "question" SET "questionText" = $1 WHERE "id" = $2', 
            [questionText, questionId], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`Question updated with question ID: ${questionId}`)
  })
}

module.exports = {
  getAllQuestions,
  addNewQuestion,
  deleteOneQuestion,
  updateOneQuestion
}