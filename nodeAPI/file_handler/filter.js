/**
 * @class
 * this class will be use to handle item sort/filtering 
 */
module.exports = function(app){ 
  const db = require('../config/db.config.js');

  app.get("/ascprice/:by_category", (req, res) => {
    
    const category = req.params.by_category
    const queryString = "SELECT * FROM images WHERE item_category = ? AND item_sold is NULL \
    ORDER BY item_price"
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
            path: row.item_name,
            owner: row.owner
        }
      })
  
      res.json(image_info)
    });
  })

  app.get("/recent/first15", (req, res) => {
    
    const queryString = "SELECT * FROM images WHERE item_sold is NULL \
    ORDER BY date_updated DESC \ LIMIT 15"
    db.query(queryString, (err, rows, fields) => {
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
            owner: row.owner
        }
      })
  
      res.json(image_info)
    });
  })

  app.get("/descprice/:by_category", (req, res) => {
    
    const category = req.params.by_category
    const queryString = "SELECT * FROM images WHERE item_category = ? AND item_sold is NULL \
    ORDER BY item_price DESC"
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
            path: row.item_name,
            owner: row.owner
        }
      })
  
      res.json(image_info)
    });
  })

  app.get("/recent/:by_category", (req, res) => {
    
    const category = req.params.by_category
    const queryString = "SELECT * FROM images WHERE item_category = ? AND item_sold is NULL \
    ORDER BY date_updated DESC"
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
            path: row.item_name,
            owner: row.owner
        }
      })
  
      res.json(image_info)
    });
  })

  app.get("/ascprice", (req, res) => {
    
    const queryString = "SELECT * FROM images WHERE item_sold is NULL \
    ORDER BY item_price"
    db.query(queryString, (err, rows, fields) => {
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
            owner: row.owner
        }
      })
  
      res.json(image_info)
    });
  })

  app.get("/descprice", (req, res) => {
    
    const queryString = "SELECT * FROM images WHERE item_sold is NULL \
    ORDER BY item_price DESC"
    db.query(queryString, (err, rows, fields) => {
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
            owner: row.owner
        }
      })
  
      res.json(image_info)
    });
  })

  app.get("/recent", (req, res) => {
    
    const queryString = "SELECT * FROM images WHERE item_sold is NULL \
    ORDER BY date_updated DESC"
    db.query(queryString, (err, rows, fields) => {
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
            owner: row.owner
        }
      })
  
      res.json(image_info)
    });
  })
}
