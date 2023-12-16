const express = require('express');
const router = express.Router();
const Cred = require('../models/Cred');
// Using a custom error handler
const ApiError = require('../utils/apiError');
const cipher = require("../utils/cipher")

const { Web5 } = require('@web5/api');

const findCred = async (email) => {
  // Check existing and prepare info for insertion
  const credExists = await Cred.findOne({ email });  
  return credExists ? credExists : undefined
}

const createRecord = async () => {
  // try {
  //   // Create and encrypt new DID
  //   const { web5, did } = await Web5.connect();
  //   const encryptedDid = cipher.encryptDID(did, "123456");

  //   const newCred = new Cred({
  //     email: "oluwatobioluyede4@gmail.com",
  //     encryptedDid: encryptedDid
  //   })

  //   // Save encrypted DID to Mongo store
  //   await newCred.save();
  // } 
  // catch (err) {
  //   if(err.name === "MongoServerError" && err.code === 11000) {
  //     console.log("Credential exists already!")
  //   } else {
  //     console.log("Error saving credential. Try again!")
  //   }
  // }
}

// router.get("/gen-did", async (req, res, next) =>
// {
//   const { secretKey } = req.query
//   console.log(req.query)

//   if (secretKey.length !== 6 || isNaN(Number(secretKey)))
//   {
//     throw new ApiError("Invalid credentials!", 400)
//   }
//   try
//   {
//     //TODO: User secret, request from client-side as a 6-digit PIN (probably alphanumeric for security reasons)
//     const userSecretKey = secretKey

//     // Create and encrypt new DID
//     const { web5, did } = await Web5.connect();
//     const encryptedDID = cipher.encryptDID(did, userSecretKey);

//     // Send DID to client side for user to copy
//     res.json({ "encryptedDID": encryptedDID })
//   } catch (error)
//   {
//     next(error)
//   }
// })

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
  if (Object.values(req.body).every(value => value == ""))
  {
    throw new ApiError("Invalid or blank input(s)!", 401);
  }
  
  const { email, secret, action } = req.body
  console.log(email, secret, action)
  if (action === "check")
  {
    // Returned response from findEmail using findOne()
    getCred = findCred(email)

    if (secret === undefined) {
      getCred 
        ? res.status(200).send("Email found!")
        : res.status(404).send("Email not found!")
    } 
    else { // Secret PIN is present, validating credentials
      if (secret.length !== 6 || isNaN(Number(secret)))
      {
        throw new ApiError("Invalid credentials!", 400)
      }

      try
      {
        // Check existing info for retrieval (login action)
        if (getCred) {
          console.log(getCred)
          const decryptedDID = cipher.decryptDID(encryptedDID, secret);
          console.log(decryptedDID)
        } 
        else {
          throw new ApiError("User already exists!", 500)
        }
        
        // Send decrypted DID to client side
        res.json({ "decryptedDID": decryptedDID })
      } catch (error)
      {
        next(error)
      }
    }
  } 
  else if (action === "create") {
    if (secret === undefined)
    {
      getCred
        ? res.status(401).send("Email is in use. Try another one..")
        : res.status(200).send("Email address available. Proceed!")
    }

    try
    {
      //TODO: User secret, request from frontend as a 6-digit PIN✅
      if (secret === undefined || secret.length === 6 || isNaN(Number(secret)))
      {
        res.status(404).send("Invalid PIN format!")
      }

      // Create and encrypt new DID
      const { web5, did } = await Web5.connect();
      const encryptedDid = cipher.encryptDID(did, secret);

      const newCred = new Cred({
        email: email,
        encryptedDid: encryptedDid
      })

      // Save encrypted DID to Mongo store
      await newCred.save();
    }
    catch (err)
    {
      if (err.name === "MongoServerError" && err.code === 11000)
      {
        console.log("Credential exists already!")
      } else
      {
        console.log("Error saving credential. Try again!")
      }
    }
  }
  // try
  // {

  //   if (action === "create")
  //   {
  //     // Check existing and prepare info for insertion
  //     const credExists = await Cred.findOne({ email });
  //     if (credExists)
  //     {
  //       throw new ApiError("User already exists!", 500)
  //     }


  //     // Save encrypted DID to Mongo store
  //     await newCred.save();
  //     res.status(201).json({
  //       "did": did,
  //       "message": "Credentials registered successfully!"
  //     })
  //   }
  //   else
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