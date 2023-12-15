const express = require('express');
const router = express.Router();
const Cred = require('../models/Cred');
const bcrypt = require('bcryptjs');
// Using a custom error handler
const ApiError = require('../utils/apiError');
const cipher = require("../utils/cipher")

const { Web5 } = require('@web5/api');

router.get("/gen-did", async (req, res, next) =>
{
  const { secretKey } = req.query
  console.log(req.query)

  if (secretKey.length !== 6 || isNaN(Number(secretKey)))
  {
    throw new ApiError("Invalid credentials!", 400)
  }
  try
  {
    //TODO: User secret, request from client-side as a 6-digit PIN (probably alphanumeric for security reasons)
    const userSecretKey = secretKey

    // Create and encrypt new DID
    const { web5, did } = await Web5.connect();
    const encryptedDID = cipher.encryptDID(did, userSecretKey);

    // Send DID to client side for user to copy
    res.json({ "encryptedDID": encryptedDID })
  } catch (error)
  {
    next(error)
  }
})

router.get("/check-did", async (req, res, next) => {
  const { secretKey,  encryptedDID} = req.query
  console.log(req.query)

  if (secretKey.length !== 6 || isNaN(Number(secretKey)))
  {
    throw new ApiError("Invalid credentials!", 400)
  }

  try {
    const userSecretKey = secretKey
    // Later, when you need to retrieve the DID
    const decryptedDID = cipher.decryptDID(encryptedDID, userSecretKey);
    
    // Send decrypted DID to client side
    res.json({ "decryptedDID": decryptedDID })
  } catch (error) {
    next(error)
  }
})


// Main endpoint for Afya DID API v2
router.post("/did", async (req, res, next) =>
{
  const { email, secret, action } = req.body
  console.log(email, secret, action)
  if (action === "check")
  {
    if (secret === undefined) {
      // Check existing and prepare info for insertion
      const credExists = await Cred.findOne({ email });
      if (credExists)
      {
        res.status(200).send("Email already exists!");
      } else
      {
        res.status(404).send("Email not found!")
      }
    }
  }
  // try
  // {
  //   if (Object.values(req.body).every(value => value == ""))
  //   {
  //     throw new ApiError("Invalid or blank input(s)!", 401);
  //   }

  //   // Validate email addresses with regex
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   // Test the email address against the regex
  //   if (emailRegex.test(req.body.email))
  //   {
  //     throw new ApiError("Invalid credentials (email)!", 401)
  //   }

  //   if (action === "create")
  //   {
  //     // Check existing and prepare info for insertion
  //     const credExists = await Cred.findOne({ email });
  //     if (credExists)
  //     {
  //       throw new ApiError("User already exists!", 500)
  //     }

  //     //TODO: User secret, request from frontend as a 6-digit PIN (probably alphanumeric for security reasons)✅

  //     if (secret.length === 6 || isNaN(Number(secret)))
  //     {
  //       throw new ApiError("Invalid credentials!", 401)
  //     }

  //     // Create and encrypt new DID
  //     const { web5, did } = await Web5.connect();
  //     const encryptedDID = cipher.encryptDID(did, userSecretKey);

  //     const newCred = new Cred({
  //       email: email,
  //       did: encryptedDID
  //     })

  //     // Save encrypted DID to Mongo store
  //     await newCred.save();
  //     res.status(201).json({
  //       "did": did,
  //       "message": "Credentials registered successfully!"
  //     })
  //   }
  //   else else
  //   {
  //     throw new ApiError("Action not specified!", 401)
  //   }
  // }
  // catch (err)
  // {
  //   next(err)
  // }
})

module.exports = router;