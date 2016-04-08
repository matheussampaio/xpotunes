const http = require('http');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');

const api = require('./routes/api');
const index = require('./routes/index');

const app = module.exports = express();

/**
 * Database Configuration
 */
const mongoose = require('mongoose');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
const uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/xpotunes';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, (err) => {
  if (err) {
    console.log(`ERROR connecting to: ${uristring}. ${err}`);
  } else {
    console.log(`Succeeded connected to: ${uristring}`);
  }
});

/**
 * Express Configuration
 */
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.static(path.resolve('www')));
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  app.use(errorHandler());
}

/**
 * Routes
 */

// API
app.use('/api', api(app));


// serve index and view partials
app.all('/*', index.index);

// app.use(function(req, res, next) {
//   res.status(404).send({ error: 'Page not found', status: 404 });
// });

/**
 * Start Server
 */
const server = http.createServer(app).listen(app.get('port'), () => {
  const port = app.get('port');

  console.log(`Express server listening on port ${port}`);
});

module.exports = server;
