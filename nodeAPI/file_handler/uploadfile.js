
/**
 * @class
 * this class will be use to handle image request 
 */
module.exports = function(app){
  const multer = require('multer');
  const readFiles = require('read-files-promise');
  const path = require('path')
  const db = require('../config/db.config.js');
  var Type = require('type-of-is');
  var fs = require('fs');
  require('console-png').attachTo(console); //for testing purpuse it display images on terminal
	
	let storage = multer.diskStorage({
		destination: (req, file, cb) => {
		  cb(null, __basedir + '/uploads/')
		},
		filename: (req, file, cb) => {
		  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});
	
	let upload = multer({storage: storage});
	/**
   * @method
   * @param
   * this method receives an image via post request and then saves it to 
   * uploads folder and also saves the image info to the image table in Mysql
   */
	app.post('/uploadfile', upload.single('image'), (req, res) => {
    message : "Error! in image upload."
    if (!req.file) {
        console.log("No file received");
          message = "Error! in image upload."
        res.render('index',{message: message, status:'danger'});
    
    } else {
		  console.log('file received');
		  console.log(req);
		  const userName = req.body.uName
		  const name = req.body.name
      const desc = req.body.desc
      const price = req.body.price
		  const category = req.body.category
		  const file_name = req.file.filename
		  const file_type = req.file.mimetype
		  const file_size = req.file.size
		  const mashup = name +" "+ desc
		  var insertimage = "INSERT INTO images (owner, display_name, item_descript, item_category, item_price, item_name, item_type, item_size) VALUES ((SELECT userName FROM user_info WHERE user_info.userName = ?), ?, ?, ?, ?, ?, ?, ?)"
		  db.query(insertimage, [userName, name, desc, category, price, file_name, file_type, file_size], (err, result)=>{
		     if (err) {
		         console.log("failed to insert new image: " + err)
		         res.sendStatus(500)
		         return
		      }else{
		          console.log('inserted data');
		       }
		    });

		    var insertsearch = "INSERT INTO search (owner, item_mashup) VALUES ((SELECT item_name FROM images WHERE images.item_name = ?), ?)"
		        db.query(insertsearch, [file_name, mashup], (err, result)=>{
		         if (err) {
		             console.log("failed to insert new search: " + err)
		             res.sendStatus(500)
		             return
		          }else{
		              console.log('inserted data');
		          }
         });
         res.sendStatus(200)
	     }
	 });
	 
	/**
 * @param 
 * it receives a get parameter with aything to look for and 
 * @returns all images that containg that in their description and/or display name
 */ 
	 app.get("/image/search/:bylike", (req, res) => {
		 const like = req.params.bylike
		 const queryString = "SELECT images.display_name, images.item_name, images.owner, images.item_category, images.item_price, images.date_updated, images.item_descript FROM images INNER JOIN search ON search.owner = images.item_name WHERE item_mashup LIKE ? AND item_sold is NULL"
		 db.query(queryString, ['%'+ like + '%'], (err, rows, fields) => {
		  if(err){
        console.log(err)
        res.sendStatus(500)
        return
      }
      const image_info = rows.map((row) => {
       return {
           name: row.display_name,
           description: row.item_descript,
           category: row.item_category,
           price: row.item_price,
           date_accessed: row.date_updated,
           path: row.item_name
        }
      })
 
      res.json(image_info)
      });
   })
/**
 * @param 
 * it receives a get parameter with a category name and 
 * @returns all images in that category 
 */
app.get("/image/:by_category", (req, res) => {
    
  const category = req.params.by_category
  const queryString = "SELECT * FROM images WHERE item_category = ? AND item_sold is NULL ORDER BY date_updated"
  db.query(queryString, [category], (err, rows, fields) => {
      if(err){
        console.log(err)
        res.sendStatus(500)
        return
      }
      const image_info = rows.map((row) => {
       return {
           name: row.display_name,
           description: row.item_descript,
           category: row.item_category,
           price: row.item_price,
           date_accessed: row.date_updated,
           path: row.item_name
        }
      })
 
      res.json(image_info)
      });
  })

app.get("/image/return/:user_selling", (req, res) => {
    
  const user_selling = req.params.user_selling
  const queryString = "SELECT * FROM images WHERE  owner = ?"
  db.query(queryString, [user_selling], (err, rows, fields) => {
      if(err){
        console.log(err)
        res.sendStatus(500)
        return
      }
      const image_info = rows.map((row) => {
       return {
           name: row.display_name,
           description: row.item_descript,
           category: row.item_category,
           price: row.item_price,
           date_accessed: row.date_updated,
           path: row.item_name,
	   item_status: row.item_sold
        }
      })
 
      res.json(image_info)
      });
  })

  /**
 * @param 
 * it receives a get parameter and 
 * @returns all images in table
 */
app.get("/allselling", (req, res) => {
    
  const name = req.params.by_name
  const queryString = "SELECT * FROM images WHERE item_sold is NULL"
  db.query(queryString, [name], (err, rows, fields) => {
      if(err){
        console.log(err)
        res.sendStatus(500)
        return
      }
      const image_info = rows.map((row) => {
       return {
           name: row.display_name,
           description: row.item_descript,
           category: row.item_category,
           price: row.item_price,
           date_accessed: row.date_updated,
           path: row.item_name
        }
      })
 
      res.json(image_info)
      });
  })

/**
 * @param 
 * it receives a get parameter with a name and 
 * @returns all images in with that name 
 */
app.get("/image/search/:by_name", (req, res) => {
    
  const name = req.params.by_name
  const queryString = "SELECT * FROM images WHERE display_name = ?"
  db.query(queryString, [name], (err, rows, fields) => {
      if(err){
        console.log(err)
        res.sendStatus(500)
        return
      }
      const image_info = rows.map((row) => {
       return {
           name: row.display_name,
           description: row.item_descript,
           category: row.item_category,
           price: row.item_price,
           date_accessed: row.date_updated,
           path: row.item_name
        }
      })
 
      res.json(image_info)
      });
  })
}

