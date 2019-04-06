const express = require('express')
const mysql = require('mysql')


//create router
const router = express.Router()

router.get("/users", (req, res) => {
    const connection = getConnection()
    const queryString = "SELECT * From user_in"
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
    password: '',
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
    const queryString = "SELECT * FROM user_in WHERE user_id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
       if(err) {
          console.log("failed to query for users " + err)
          res.sendStatus(500)
        return
       }
        console.log("I think we got users")
        const users = rows.map((row) => {
            return {first: row.first_Name, last: row.last_Name, ID: row.student_id, userName: row.userName,}
        })
        //you can display everything by using the following line of code
        //res.json(rows)
        //or display custom by using const users above and then using 
        res.json(users)
    })
})


router.post('/user_create', (req, res) => {
    console.log("getting user input")
    console.log("First name: " + req.body.create_first_name)
    const firstName = req.body.create_first_name
    const lastName = req.body.create_last_name
    const studentID = req.body.create_student_id
    const userName = req.body.create_username
    const password = req.body.create_psw
    
    const queryString = "INSERT INTO user_in (first_Name, last_Name, student_id, userName, user_password) VALUES (?, ?, ?, ?, ?)"
    getConnection().query(queryString, [firstName, lastName, studentID, userName, password], (err, results, fields) => {
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
