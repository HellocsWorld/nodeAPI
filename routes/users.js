const express = require('express')
const mysql = require('mysql')


//create router
const router = express.Router()

router.get("/users", (req, res) => {
    const connection = getConnection()
    const queryString = "SELECT * From users"
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            console.log("Failed to query for users: " + err)
            res. sendStatus(500)
            return
        }
        res.json(rows)
    })  
})

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'BzX3J#RgczvFxK3$',
    database: 'users_info'

})

function getConnection(){
    return pool
}

//create single connection. not good but work
//function getConnection() {
//   return mysql.createConnection({
 //         host: 'localhost',
//          user: 'root',
//          password: 'BzX3J#RgczvFxK3$',
//          database: 'users_info'
//      })
//  }

router.get('/user/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)
    
    const connection = getConnection()

    const userId = req.params.id
    const queryString = "SELECT * FROM users WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
       if(err) {
          console.log("failed to query for users " + err)
          res.sendStatus(500)
        return
       }
        console.log("I think we got users")
        const users = rows.map((row) => {
            return {first: row.firstName, last: row.lastName}
        })
        res.json(users)
    })
})

router.post('/user_create', (req, res) => {
    console.log("getting user input")
    console.log("First name: " + req.body.create_first_name)
    const firstName = req.body.create_first_name
    const lastName = req.body.create_last_name
    
    const queryString = "INSERT INTO users (firstName, lastName) VALUES (?, ?)"
    getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
        if (err) {
            console.log("failed to insert new user: " + err)
            res.sendStatus(500)
            return
        }
        console.log("Inserted a new user with id: ", results.insertId);
       res.end()
    })    
})


module.exports = router