!('NODE_ENV' in process.env) && require('dotenv').config();
const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');

const testRoutes = require('./routes/testroutes.js')

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});

//testing routers with local db
app.use('/api/test', testRoutes);

// the "catchall" handelr: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);