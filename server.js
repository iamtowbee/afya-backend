require("dotenv").config()
const express = require("express")
// const bodyParser = require('body-parser');
const cors = require("cors")
const ApiError = require('./utils/apiError');
require("./config/db")
const authRoute = require("./routes/authRoute")

const PORT = process.env.PORT || 4000
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const jwtCheck = auth({
//   audience: 'afya-auth',
//   issuerBaseURL: 'https://dev-lqqsrxo3jsnkum2a.us.auth0.com/',
//   tokenSigningAlg: 'RS256',
//   authRequired: false
// })
// // enforce on all endpoints
// app.use(jwtCheck)

app.use("/", authRoute)

// Error handling middleware
app.use((err, req, res, next) =>
{
  console.log('Error Middleware:\n', err);
  if (err.name === 'ApiError')
  {
    res.status(err.statusCode).send(err);
  } else
  {
    // Check for the specific error code indicating bad decrypt
    if (err.code === 'ERR_OSSL_BAD_DECRYPT')
    {
      // Respond to the client with a more specific message
      res.status(400).json({ error: 'Incorrect PIN. Please check your PIN and try again.' });
    } else
    {
      // For other errors, respond with a general error message
      res.status(500).json({ ...err, statusCode: 500 });
    }
  }
});

app.listen(PORT, () =>
{
  console.log(`Listening on port ${PORT}...`)
})