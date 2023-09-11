require('dotenv').config()
const express = require('express')

require('./config/modelConfig')
const mainRouter = require('./routes/mainRoute')

const app = express()
app.use(express.json())
app.use('/',mainRouter)

const HOST = "localhost";
const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log("Server is running on port: ",PORT)
})

