const mongoose = require('mongoose')
const User = require('./user')

const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true })

taskSchema.methods.toJSON = function() {
    const task = this
    
    const taskObject = task.toObject()
    
    delete taskObject.version
    
    return taskObject
  }

const Task = mongoose.model('Task', taskSchema);

module.exports = Task