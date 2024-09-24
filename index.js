const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(cors(
    {
        origin:"*"
    }
))

app.get("/", (req, res) =>{
    res.json({data: "This is NTS server"});
});

app.listen(1040, () => {
    console.log(`Server is Listening on http://localhost:1040`)
})