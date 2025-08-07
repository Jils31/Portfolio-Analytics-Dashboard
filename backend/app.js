const express = require('express')
const cors = require('cors')

const app = express()

//middlewares for the cors policy and the reading json data
app.use(cors())
app.use(express.json())

//Routes for the required endpoints
const portfolioRoutes = require('./routes/portfolioRoutes')
app.use('/api/portfolio', portfolioRoutes)

//Hanlding other routes
app.use((req,res) => {
    res.status(404).json({
        success:false,
        message:"API endpoint not found"
    })
})

//Server
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log("Server started"))