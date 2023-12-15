require("dotenv").config()
const express = require("express")
const bodyParser = require('body-parser');
const cors = require("cors")
const axios = require("axios")
const { auth } = require('express-oauth2-jwt-bearer');
const mongodb = require("mongodb")
const Cred = require("./models/Cred")
const ApiError = require('./utils/apiError');
require("./config/db")
const defaultRoute = require("./routes/defaultRoute")

const PORT = process.env.PORT || 4000
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const jwtCheck = auth({
  audience: 'afya-auth',
  issuerBaseURL: 'https://dev-lqqsrxo3jsnkum2a.us.auth0.com/',
  tokenSigningAlg: 'RS256',
  authRequired: false
})
// enforce on all endpoints
app.use(jwtCheck)

app.use("/", defaultRoute)

// Error handling middleware
app.use((err, req, res, next) =>
{
  console.log('Error Middleware:\n', err);
  if (err.name === 'ApiError')
  {
    res.status(err.statusCode).send(err);
  } else
  {
    res.status(500).json({ ...err, statusCode: 500 });
  }
});

app.listen(PORT, () =>
{
  console.log(`Listening on port ${PORT}...`)
})