const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'S0ULk33p3r!',
    database : 'all-seeing-eye'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(database.users) });
app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(3001, () => {
  console.log('Server is running on port 3001.')
});


/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user{}
/profile/:userId --> GET = user{}
/image --> PUT --> user{}

*/