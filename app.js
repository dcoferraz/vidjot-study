const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const pjson = require('./package.json');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');

/**
 * Basic config
 * default port: 5000
 */
const app = express();
const port = 5000;

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

/**
 * Routing
 */
// Index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about', {
    version: pjson.version
  });
});

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

// Start the APP
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});