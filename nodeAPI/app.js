//load our app server using express
const express = require('express')
var cors = require('cors')
const app = express()
const morgan = require('morgan')

const bodyParser = require('body-parser')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))

//important.. this line creates a connection to use static files such as html saved in the
//folder public
app.use(express.static('./public'))

app.use(express.static('./uploads'));

app.use(morgan('short'))

global.__basedir = __dirname;
require('./file_handler/uploadfile.js')(app);
require('./file_handler/filter.js')(app);


//create router
//this is important because it creates a connection to the users folder and runs the users.js folder
const router = require('./routes/users.js')
app.use(router)

const messageRouter = require('./routes/messages.js')
app.use(messageRouter)

//localhost:3003
app.get('/', function(req, res) {
    res.send('Team01 CSC 648 API');
});

//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.listen(3003, () => {
    console.log("Server is up and listening on 3003...")
})
