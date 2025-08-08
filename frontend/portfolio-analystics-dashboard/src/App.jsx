import './App.css'
import AssetDistribution from './components/portfolio/AssetDistribution'
import Performance from './components/portfolio/Performance'
import Holdings from './components/portfolio/HoldingsTable'
import TopPerformers from './components/portfolio/TopPerformers'
import PortfolioOverview from './components/portfolio/PortfolioOverview'

function App() {

  return (
    <>
    <PortfolioOverview />
    <AssetDistribution />
    <Holdings />
    <Performance />
    <TopPerformers />
    </>
  )
}

export default App
