const express = require('express')
const db = require('../config/db.config.js');
/*
#add item
 New table
 create table messages (
     message_id INT(11) auto_increment not null Primary key,
     item_id INT(11),
     seller varchar(64) NOT null,
     buyer varchar(64) not null,
     message TEXT not null,
     sent_by varchar(64) not null,
     date_sent datetime DEFAULT CURRENT_TIMESTAMP,
     foreign key (seller) references user_info(userName),
     foreign key (buyer) references user_info(userName),
     foreign key (item_id) references images(item_id)
     )
    
*/
const router = express.Router()


//selects all of the messages and sends as a response
router.get("/allmessages", (req, res) => {
    
    const queryString = "SELECT * FROM messages ORDER BY seller, date_sent"

    //gets messages between seller, buyer and item
    db.query(queryString, (err, rows, fields) => {
        if(err){
            console.log(err)
            return
        } 
        console.log("query success")
        res.json(rows)
    })
     
})

//sends messages between seller, buyer and item
router.get("/messages/:seller/:item", (req, res) => {
//router.get("/messages/:seller/:buyer/", (req, res) => {
    const sellerID = req.params.seller
    //const buyerID = req.params.buyer
    const itemId = req.params.item
    //const queryString = "SELECT * FROM messages WHERE seller = ? AND item_id = ? ORDER BY date_sent"
    const queryString = "SELECT item_ID, seller, buyer, message, sent_by, DATE(date_sent), TIME(date_sent) \
     FROM messages WHERE seller = ? AND item_id = ? ORDER BY seller, TIME(date_sent)"
    console.log(queryString)
    //gets messages between seller, buyer and item
    db.query(queryString, [sellerID,itemId], (err, rows, fields) => {
        if(err){
            console.log(err)
            return
        } 
        console.log("query success")
        res.json(rows)
    })
     
})


//used to add new messages
router.post("/nextMessage", (req, res) => {
    const seller = req.body.seller
    const buyer = req.body.buyer
    const item = req.body.item
    const message = req.body.message
    const sentBy = req.body.sentBY
    
    const queryString = "INSERT INTO messages (seller, buyer, item_id, message, sent_by) VALUES (?, ?, ?, ?, ?)" 
    db.query(queryString, [seller, buyer, item, message, sentBy], (err, result) => {
        if(err){
            console.log(err)
            return
        } else {
            console.log('insert into messages was succesful')
            return
        }
    })
})

module.exports = router