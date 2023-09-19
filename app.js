

require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
//overrride
const methodOverride = require('method-override');
//flash
const { flash } = require('express-flash-message');
const session = require('express-session');
//database
const connectDB = require('./server/config/db');


const app = express();
const port = 5000 || process.env.PORT;

//connect to database
connectDB();

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

//static files
app.use(express.static('public'));

//express session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        }
    })

);

// Flash messages
app.use(flash({ sessionKeyName: 'flashMessage'}));

//templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//routes
app.use('/', require("./server/routes/customer"))



//Handle 404
app.get('*', (req, res) => {
    res.status(404).render('404');
});


app.listen(port, () =>{
    console.log(`App listening on port ${port}`)
});

