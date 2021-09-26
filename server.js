require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const app = express();
app.use(express.json());
app.use(cors());

const User = require('./models/user')(db);

app.get('/', (req, res) => {
  res.send('hi');
})

const AuthController = require('./controllers/auth')(User);
app.post('/signin', AuthController.signin);
app.post('/signup', AuthController.signup);

const UserController = require('./controllers/user')(User);
app.post('/update-entries', UserController.updateEntries);
app.get('/profile/:username', UserController.getUserProfile);

const ImageController = require('./controllers/image')();
app.post('/image', ImageController.imageData);



app.get('/leaderboard', (req, res) => {
  // select first_name, entries from users ORDER BY entries DESC limit 10;
});

// catch-all for non-existing routes
app.get('*', function(req, res){
  return res.status(404).json({ message: 'Invalid URL'});
});

app.listen(process.env.PORT || 3000, () => console.log(`Smart Brain Backend is running`));


/*
  API DESIGN
  /signin --> POST returns success/fail
  /signup --> POST returns new user
  /profile/:userId --> GET returns user
  /image --> POST data to clarifai API
  /update-entries --> PUT returns user count
  /leaderboard --> GET returns top 10 entries and first name from users table
  /total-users --> GET count from users table
  /average-entries-score --> GET AVG from all users entries
*/
