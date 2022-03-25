const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

//create new task
router.post('/tasks', auth, async(req, res) => {
    const user = req.user

    const task = new Task({
        ...req.body,
        owner: user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all tasks associated with a certain user
router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = (parts[1] == 'asc') ? 1 : -1
    }

    if (req.query.completed) {
        match.completed = (req.query.completed === 'true')
    }
    try {
        //console.log('test')
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })

        res.send(req.user.tasks)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

//modify account details
router.patch('/tasks', auth, async(req, res) => {
    const mods = req.body
    const taskId = req.body._id
    console.log(taskId)
    delete mods._id
    const props = Object.keys(mods)
    const modifiable = ['title', 'description', 'completed']
    const isValid = props.every((prop) => modifiable.includes(prop))
  
    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates.' })
    }
  
    try {
        await Task.updateOne({_id: taskId}, {$set: {"title": req.body.title, "description": req.body.description, "completed": req.body.completed}})
        res.send(req.body)
    } catch (e) {
        res.status(400).send()
        console.log(e)
    }
  })
  

//delete task
router.delete('/tasks', auth, async (req, res) => {
    try {
        await Task.deleteOne({_id: req.body._id})
        res.send(req.body)
    } 
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router