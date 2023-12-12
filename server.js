const express = require("express")
const cors = require("cors")
const axios = require("axios")
const { auth } = require('express-oauth2-jwt-bearer');
const mongodb = require("mongodb")

// To connect with your mongoDB database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/', {
  dbName: 'auth',
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(console.log("Connected to DB!"))
.catch(err => console.log(err))

// Schema for credentials of users
const CredSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that each email address is unique in the collection
    trim: true,
    lowercase: true,
  },
  did: {
    type: String,
    required: true,
    unique: true, // Ensures that each DID is unique in the collection
    trim: true,
  },
});
const Cred = mongoose.model('cred', CredSchema);
Cred.createIndexes();

const PORT = process.env.PORT || 4000
const app = express()
app.use(cors())
app.use(express.json())

const jwtCheck = auth({
  audience: 'afya-auth',
  issuerBaseURL: 'https://dev-lqqsrxo3jsnkum2a.us.auth0.com/',
  tokenSigningAlg: 'RS256',
  authRequired: false
})
// enforce on all endpoints
app.use(jwtCheck)

app.get("/index", (req, res) => {
  res.send("Hello from index")
})

app.get("/protected", (req, res) =>
{
  res.send("Hello from protected route")
})

app.get("/save-did", async (req, res) => {
  try {
    const cred = new Cred(req.body)
    let response = await cred.save()
    response = response.toJSON()
    if (response) {
      res.send(response)
      console.log(response)
    } else {
      res.send("Email already in use!")
      console.log("Email already in use!")
    }
  } catch (error) {
    res.send("Something went wrong, try again!")
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})