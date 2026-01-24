const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose")
require("dotenv").config()
const authRoutes = require("./routes/auth.js")
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("db connection")
    })
    .catch((err) => {
    console.log(err)
})
app.use("/api", authRoutes)
app.get("/", (req, res) => {
    res.send("Welcome to the Auth API")
})
app.listen(port, () => console.log("it is working on ", port))


