const express = require('express')
const { sendWelcomeEmail } = require('../emails/account')
const User = require('../models/user')

const router = new express.Router()

// Add a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    res.status(201).send(user)
  } 
  catch(error) {
    res.status(400).send(error)
  }
})

module.exports = router

