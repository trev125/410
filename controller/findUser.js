const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'CYOA',
  password: 'postgres',
  port: 5432,
})

const findOneUser = (request, response) => {
  const userId = parseInt(request.params.userId)
  pool.query('SELECT * FROM "user" WHERE "email" = $1', [userId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  findOneUser
}