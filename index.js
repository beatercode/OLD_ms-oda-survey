const express = require('express')
const survey = require('./routers/survey')
const Database = require("./config/Database")
const app = express()
const port = 3000

const db = new Database()
db.connect()

app.get('/', (req, res) => {
    res.send('ODA Survey is Online')
})

app.use(express.json())
app.use('/survey', survey)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})