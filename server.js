const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');

const Author = require('./Authors/AuthorModel.js');
const Book = require('./Books/BookModel.js');

const server = express();

server.use(helmet());
server.use(bodyParser.json());

// Your API will be built out here.
server.get('/', function(req, res) {
  res.status(200).json({ api: 'running' });
});

server.get('/users/:direction', (req, res) => {
  const { direction } = req.params; //asc desc
  Person.find({})
    .sort({ firstName: direction })
    .exec((err, sortedUsers) => {
      if (err) {
        res.status(422).json({ 'Error getting/sorting your users: ': err });
        return;
      }
      res.json(sortedUsers);
    });
});

server.get('/users-get-friends/:id', (req, res) => {
  const { id } = req.params;
  Person.findById(id)
    .select('friends')
    .exec((err, friends) => {
      if (err) {
        res.status(422).json({ 'Could not find that id: ': err });
        return;
      }
      res.json(friends);
    });
});

server.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  Person.findByIdAndUpdate( id, { firstName, lastName }, { new: true }).exec(
    (err, updatedUser) => {
      if (err) {
        res.status(422).json({ 'Could not find that id: ': err });
        return;
      }
      res.json(updatedUser);
    }
  );
});

mongoose.connect('mongodb://localhost/library').then(
  () => {
    const port = process.env.PORT || 3000;
    server.listen(port);
    console.log(`Server Listening on ${port}`);
  },
  err => {
    console.log('\n************************');
    console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
    console.log('************************\n');
  }
);
