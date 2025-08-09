const express = require('express')
const cors = require('cors')

const app = express()

//middlewares for the cors policy and the reading json data
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Welcome to the Backend of the Portfolio Analytics Dashboard",
        availableEndpoints: {
            holdings: "/api/portfolio/holdings",
            allocation: "/api/portfolio/allocation",
            performance: "/api/portfolio/performance",
            summary: "/api/portfolio/summary",
            overview:"/api/portfolio/overview"
        },
        note: "Append these paths to the base URL to access different sections of the portfolio data."
    });
});


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