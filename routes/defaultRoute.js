const express = require('express');
const router = express.Router();
const Cred = require('../models/Cred');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const cipher = require("../utils/cipher")

router.get("/index", (req, res) =>
{
  res.send("Hello from index")
})

router.get("/protected", (req, res) =>
{
  res.send("Hello from protected route")
})

router.get("/gen-did", async (req, res, next) =>
{
  try
  {
    const did = 'someDIDvalue';
    const userSecretKey = "nyan-cat"

    // Encrypt the DID
    const encryptedDID = cipher.encryptDID(did, userSecretKey);
    console.log("Encrypted DID:", encryptedDID)
  } catch (error)
  {
    next(error)
  }
})

router.get("/check-did", async (req, res, next) => {
  try {
    const encryptedDID = "9725f2a37233d12c6681881bcb5c73960cd18de8f0785db2"
    const userSecretKey = "nyan-cat"
    // Later, when you need to retrieve the DID
    const decryptedDID = cipher.decryptDID(encryptedDID, userSecretKey);
    console.log('Decrypted DID:', decryptedDID);
  } catch (error) {
    next(error)
  }
})


router.post("/did", async (req, res, next) =>
{
  try
  {
    if (Object.values(req.body).every(value => value == ""))
    {
      throw new ApiError("Invalid or blank input(s)!", 401);
    }

    const { email, did, action } = req.body
    if (action === "check")
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
    } else if (action === "create")
    {
      // Check existing and prepare info for insertion
      const credExists = await Cred.findOne({ email });
      if (credExists)
      {
        throw new ApiError("User already exists!", 500)
      }

      // Hash email and DID with salt
      const salt = await bcrypt.genSalt(10);
      const hashedDid = await bcrypt.hash(did, salt);

      const newCred = new Cred({
        email: email,
        did: hashedDid
      })

      await newCred.save();
      res.status(201).json({
        message: "Credentials registered successfully!"
      })

      // try
      // {
      //   let response = await newCred.save()
      //   console.log("Save response:", response)
      //   if (response)
      //   {
      //     res.json(response)
      //     console.log(response)
      //   } else
      //   {
      //     res.status(409).send("Email already in use!")
      //     console.log("Email already in use!")
      //   }
      // } catch (error)
      // {
      //   res.send(error)
      // }
    } else
    {
      throw new ApiError("Action not specified!", 401)
    }
  }
  catch (err)
  {
    next(err)
  }
})

module.exports = router;