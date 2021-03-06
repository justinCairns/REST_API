const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

const app = express()
app.use(express.json())

app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(userRouter)

app.use(taskRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('API service is up on port ' + port)
})

console.log(process.env.JSON_WEB_TOKEN_SECRET)