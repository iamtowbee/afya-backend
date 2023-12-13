const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

// To connect with your mongoDB database
mongoose.connect(process.env.MONGO_URL, {
  dbName: 'auth',
})
  .then((conn) =>
  {
    console.log(`Database connected! ${conn.connection.host}`);
  })
  .catch((err) =>
  {
    console.log(`Error connecting to DB. ${err}`);
  })