const express = require('express');
const router = express.Router();
const Cred = require('../models/Cred');
const bcrypt = require('bcryptjs');
// Using a custom error handler
const ApiError = require('../utils/apiError');
const cipher = require("../utils/cipher")

const { Web5 } = require('@web5/api');

// Test route
// router.get("/test", async (req, res, next) => {
//   const { web5, did } = await Web5.connect();
//   console.log(did)
//   res.json({"did": did})
// })

// router.get("/gen-did", async (req, res, next) =>
// {
//   try
//   {
//     //TODO: User secret, request from client-side as a 6-digit PIN (probably alphanumeric for security reasons)
//     const userSecretKey = "nyan-cat" // Example user secret key

//     // Create and encrypt new DID
//     const { web5, did } = await Web5.connect();
//     const encryptedDID = cipher.encryptDID(did, userSecretKey);

//     // Send DID to client side for user to copy
//     res.json({"did": did})
//   } catch (error)
//   {
//     next(error)
//   }
// })

// router.get("/check-did", async (req, res, next) => {
//   try {
//     const encryptedDID = "9725f2a37233d12c6681881bcb5c73960cd18de8f0785db2"
//     const userSecretKey = "nyan-cat"
//     // Later, when you need to retrieve the DID
//     const decryptedDID = cipher.decryptDID(encryptedDID, userSecretKey);
//     console.log('Decrypted DID:', decryptedDID);
//   } catch (error) {
//     next(error)
//   }
// })


router.post("/did", async (req, res, next) =>
{
  try
  {
    if (Object.values(req.body).every(value => value == ""))
    {
      throw new ApiError("Invalid or blank input(s)!", 401);
    }

    // Validate email addresses with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email address against the regex
    if (emailRegex.test(req.body.email)) {
      throw new ApiError("Invalid credentials (email)!", 401)
    }

    const { email, secret, action } = req.body
    if (action === "create")
    {
      // Check existing and prepare info for insertion
      const credExists = await Cred.findOne({ email });
      if (credExists)
      {
        throw new ApiError("User already exists!", 500)
      }

      //TODO: User secret, request from frontend as a 6-digit PIN (probably alphanumeric for security reasons)✅

      if (secret.length === 6 || isNaN(Number(secret))) {
        throw new ApiError("Invalid credentials!", 401)
      }

      // Create and encrypt new DID
      const { web5, did } = await Web5.connect();
      const encryptedDID = cipher.encryptDID(did, userSecretKey);

      const newCred = new Cred({
        email: email,
        did: encryptedDID
      })

      // Save encrypted DID to Mongo store
      await newCred.save();
      res.status(201).json({ 
      "did": did, 
      "message": "Credentials registered successfully!"
      })
    }
    else if (action === "check")
    {
      // Check existing and prepare info for insertion
      const credExists = await Cred.findOne({ email });
      if (credExists)
      {
        res.status(200).send("User already exists!");
      } else
      {
        throw new ApiError("User not found!", 404)
      }
    } else
    {
      throw new ApiError("User action not specified!", 401)
    }
  }
  catch (err)
  {
    next(err)
  }
})

module.exports = router;