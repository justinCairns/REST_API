const express = require('express')
const { sendWelcomeEmail } = require('../emails/account')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

// Add a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()

    sendWelcomeEmail(user.email, user.name)
    res.status(201).send({user, token})
  } 
  catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
})

//logout a user
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    
    res.send()
  }
  catch (e) {
    res.status(500).send()
  }
})

module.exports = router

