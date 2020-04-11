const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'CYOA',
  password: 'postgres',
  port: 5432,
})

const getAllAnswers = (request, response) => {
  pool.query('SELECT * FROM answer', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addNewAnswer = (request, response) => {
  const questionId = parseInt(request.params.questionId)
  const answer = request.body[0].answer

  pool.query('INSERT INTO "answer" ("answer", "question") VALUES ($1, $2)', 
            [answer, questionId], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`Answer added!`)
  })
}

const deleteAnswer = (request, response) => {
  const answerId = parseInt(request.params.answerId)

  pool.query('DELETE FROM "answer" WHERE "id" = $1', 
            [answerId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Answer with ID of ${answerId} has been deleted`)
  })
}

const updateOneAnswer = (request, response) => {
  const answerId = parseInt(request.params.answerId)
  const answer = request.body[0].answer
  const question = request.body[0].question

  pool.query('UPDATE "answer" SET "answer" = $1, "question" = $2 WHERE "id" = $3', 
            [answer, question, answerId], (error, results) => {
    if (error) {
      throw error
    }
    //TODO: Add in the correct return ID
    //response.status(201).send(`Character added to user with ID: ${results.id}`)
    response.status(201).send(`Answer updated with answer ID: ${answerId}`)
  })
}

module.exports = {
  getAllAnswers,
  addNewAnswer,
  deleteAnswer,
  updateOneAnswer
}