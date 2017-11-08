const express = require('express');
const exphbs = require('express-handlebars');
const pjson = require('./package.json');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/**
 * Basic config
 * default port: 5000
 */
const app = express();
const port = 5000;

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

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

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });

})

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add', {
    version: pjson.version
  });
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  }

  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details
    };

    new Idea(newIdea)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});