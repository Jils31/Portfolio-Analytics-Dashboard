const express = require('express')
const router = express.Router()

const {getHoldings, getAllocations, getPerformance, getSummary, getPortfolioOverview} = require('../controllers/portfolioControllers')


router.get('/holdings', getHoldings);
router.get('/allocations', getAllocations);
router.get('/performance', getPerformance);
router.get('/summary', getSummary)
router.get('/overview', getPortfolioOverview)

module.exports = router;