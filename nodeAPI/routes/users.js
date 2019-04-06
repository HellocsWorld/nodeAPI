/**
 * @module
 * this class will be used to handle get and post request for 
 * user related info. 
 */

const express = require('express')
const db = require('../config/db.config.js');
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser');

//create router
const router = express.Router()
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());
router.use(cookieParser());
router.use(cors());
/**
 * @return
 * 
 */

router.get('/login', (req, res) => {
    const login = req.query.userName
    const password = req.query.password
    console.log("DATA: " + login + " " + password)
    const queryString = "SELECT userName, user_password From user_info WHERE userName = ? "
    db.query(queryString, [login, password], (err, rows, fields) => {
        if(err){
          console.log("Failed to query for users: " + err)
          res.sendStatus(500)
            return
        }

        let hashPassword = rows[0].user_password
        
        //compares hashed password with the one sent in
        bcrypt.compare(password, hashPassword, (err, res2) => {
          res.json(res2)
        })
    })  
})

router.get('/usercheck', (req, res) => {  
    //user id becomes the id number we want to look for 
    const userName = req.query.userName
    const studentID = req.query.studentID 
    //this code selcts all the user information by user id 
    const queryString = "SELECT userName FROM user_info WHERE userName = ? AND student_id = ?" 
    db.query(queryString, [userName, studentID], (err, rows, fields) => {
        console.log(Object.keys(rows).length)
        if(err) {
            console.log("failed to query for users " + err)
            res.sendStatus(500)
          return
         } else if(Object.keys(rows).length == 0) {
             res.json("false")
         }else{
             res.json(rows)
         }
    })
})

router.post('/passreset', (req, res) => {  
    //user id becomes the id number we want to look for s
    const userName = req.query.userName
    const password = req.query.password 
    //this code selcts all the user information by user id 
    bcrypt.hash(password, 10, (err,hash) => {
    const queryString = "UPDATE user_info SET user_password = ? WHERE userName = ?" 
    db.query(queryString, [hash, userName], (err, rows, fields) => {
       if(err) {
          console.log("failed to query for users " + err)
          res.send(err)
        return
       }
       res.sendStatus(200)
    })
  })
})




/**
 * @param
 * @returns
 * this method received a request and gets the user info by 
 * user id and then returns the information in a .json file.
 */
router.get('/user/:userName', (req, res) => {  
    //user id becomes the id number we want to look for 
    const userId = req.params.userName  
    //this code selcts all the user information by user id 
    const queryString = "SELECT * FROM user_info WHERE userName = ?" 
    db.query(queryString, [userId], (err, rows, fields) => {
       if(err) {
          console.log("failed to query for users " + err)
          res.sendStatus(500)
        return
       }
        console.log("everything seems good")
        //this line gets the user first name and last name and then adds it to users constant 
        const users = rows.map((row) => {
            return {first: row.first_Name, last: row.last_Name}
        })
        //this line displays the user first name ans last name
        res.json(rows)
    })
})

/**
 * @method
 * @param
 * it gets the user info and saves it to users table in MySql
 */ 
router.post('/user_create', (req, res) => {
    const firstName = req.body.create_first_name
    const lastName = req.body.create_last_name
    const studentID = req.body.create_student_id
    const userName = req.body.create_username
    const password = req.body.create_psw
    
    //this line will insert a new user_info with the rows in the parenthesis and then 
    //add the info from the user.
    bcrypt.hash(password, 10, (err,hash) => {
        const queryString = "INSERT INTO user_info (first_Name, last_Name, student_id, userName, user_password) VALUES (?, ?, ?, ?, ?)"
        db.query(queryString, [firstName, lastName, studentID, userName, hash], (err, results, fields) => {
          if (err) {
            console.log("failed to insert new user: " + err)
            message = "failed to insert new user: " + err
            return res.status(400).send({
             message: message
           });
          }else{
            res.sendStatus(200)
          }    
        })
    })
    
})


module.exports = router
