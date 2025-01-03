const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123lisisdaxcz',
  database: 'gestion_file'
})

db.connect(err => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err)
    process.exit(1)
  } else {
    console.log('Conectado a la base de datos MySQL')
  }
})

module.exports = db
