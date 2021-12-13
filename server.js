//Packages
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');

//Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const rank = require('./controllers/rank');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const users = require('./controllers/users');

//Swagger Config
const swaggerDocument = require('./swagger.json');

//DB Connection
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

//App Declaration
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//End Points
app.get('/', (req, res) => {
  res.send('It is working!');
});
app.post('/signin', signin.signinAuthentication(db, bcrypt));
app.post('/register', register.registerAuthentication(db, bcrypt));
app.get('/users', auth.requireAuth, (req, res) => {
  users.getAllUsers(req, res, db);
})
app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});
app.post('/rank', auth.requireAuth, (req, res) => {
  rank.getRank(req, res);
});
app.put('/image', auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});
app.get('/swagger.json', (req, res) => {
  res.send(swaggerDocument);
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`App is Running on Port ${process.env.PORT || 3000}`);
});
