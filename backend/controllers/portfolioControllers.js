const holdings = require("../data/holdings.json");

const validatePortfolioData = (req,res,next) => {
    if(!holdings || holdings.length == 0){
        return res.status(404).json({error:"No portfolio data found"})
    }

    next()
}

const getHoldings = (req, res) => {
  return res.status(200).json(holdings);
};

const getAllocations = (req, res) => {
  try {
    let totalValue = 0;

    let bySector = {};
    let byMarketCap = {};

    holdings.forEach((stock) => {
      const { sector, marketCap, value } = stock;
      const numericalValue = parseFloat(value);
      totalValue += numericalValue; //Calculated total value of each stock from the mock data available

      if (!bySector[sector]) {
        bySector[sector] = { value: 0 };
      }
      bySector[sector].value += numericalValue;

      if (!byMarketCap[marketCap]) {
        byMarketCap[marketCap] = { value: 0 };
      }
      byMarketCap[marketCap].value += numericalValue;
    });

    for (const sector in bySector) {
      const value = bySector[sector].value;
      bySector[sector].percentage = parseFloat(
        (value / totalValue) * 100
      ).toFixed(1);
    }

    for (const marketCap in byMarketCap) {
      const value = byMarketCap[marketCap].value;
      byMarketCap[marketCap].percentage = parseFloat(
        (value / totalValue) * 100
      ).toFixed(1);
    }

    return res.status(200).json({ bySector, byMarketCap });
  } catch (err) {
    console.error("Error calculating allocations: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPerformance = (req, res) => {
  try {
    // Mock historical data - in real implementation, this would come from a database (As it is not present in the Excel sheet)
    const timeline = [
      {
        date: "2024-01-01",
        portfolio: 650000,
        nifty50: 21000,
        gold: 62000,
      },
      {
        date: "2024-02-01",
        portfolio: 662000,
        nifty50: 21300,
        gold: 63200,
      },
      {
        date: "2024-03-01",
        portfolio: 680000,
        nifty50: 22100,
        gold: 64500,
      },
      {
        date: "2024-04-01",
        portfolio: 685000,
        nifty50: 22400,
        gold: 65800,
      },
      {
        date: "2024-05-01",
        portfolio: 695000,
        nifty50: 23200,
        gold: 67200,
      },
      {
        date: "2024-06-01",
        portfolio: 700000,
        nifty50: 23500,
        gold: 68000,
      },
    ];

    // Calculate returns based on timeline data
    const currentData = timeline[timeline.length - 1];
    const oneMonthAgo = timeline[timeline.length - 2];
    const threeMonthsAgo = timeline[timeline.length - 4];
    const oneYearAgo = timeline[0]; // Assuming we have 1 year of data

    const calculateReturn = (current, previous) => {
      return parseFloat((((current - previous) / previous) * 100).toFixed(1));
    };

    const returns = {
      portfolio: {
        "1month": calculateReturn(currentData.portfolio, oneMonthAgo.portfolio),
        "3months": calculateReturn(
          currentData.portfolio,
          threeMonthsAgo.portfolio
        ),
        "1year": calculateReturn(currentData.portfolio, oneYearAgo.portfolio),
      },
      nifty50: {
        "1month": calculateReturn(currentData.nifty50, oneMonthAgo.nifty50),
        "3months": calculateReturn(currentData.nifty50, threeMonthsAgo.nifty50),
        "1year": calculateReturn(currentData.nifty50, oneYearAgo.nifty50),
      },
      gold: {
        "1month": calculateReturn(currentData.gold, oneMonthAgo.gold),
        "3months": calculateReturn(currentData.gold, threeMonthsAgo.gold),
        "1year": calculateReturn(currentData.gold, oneYearAgo.gold),
      },
    };

    return res.status(200).json({
      timeline,
      returns,
    });
  } catch (err) {
    console.error("Error calculating performance: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSummary = (req, res) => {
  try {
    let totalValue = 0;
    let totalInvested = 0;
    let topPerformer = null;
    let worstPerformer = null;

    holdings.forEach((stock) => {
      const currentValue = parseFloat(stock.value);
      const investedValue =
        parseFloat(stock.quantity) * parseFloat(stock.avgPrice);
      const gainLossPercent = parseFloat(
        stock.gainLossPercent.replace("%", "")
      );

      totalValue += currentValue;
      totalInvested += investedValue;

      // Find top performer
      if (
        !topPerformer ||
        gainLossPercent >
          parseFloat(topPerformer.gainLossPercent.replace("%", ""))
      ) {
        topPerformer = stock;
      }

      // Find worst performer
      if (
        !worstPerformer ||
        gainLossPercent <
          parseFloat(worstPerformer.gainLossPercent.replace("%", ""))
      ) {
        worstPerformer = stock;
      }
    });

    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercent = parseFloat(
      ((totalGainLoss / totalInvested) * 100).toFixed(2)
    );

    // Calculate diversification score (based on number of sectors and distribution)
    const sectors = {};
    holdings.forEach((stock) => {
      if (!sectors[stock.sector]) {
        sectors[stock.sector] = 0;
      }
      sectors[stock.sector] += parseFloat(stock.value);
    });

    const sectorCount = Object.keys(sectors).length;
    if(sectorCount.length == 0){
        return res.status(400).json({error:"No sector data is found"})
    }


    const maxSectorAllocation =
      Math.max(...Object.values(sectors)) / totalValue;
    const diversificationScore = Math.min(
      10,
      sectorCount * 1.2 - maxSectorAllocation * 10
    );

    // Determine risk level based on sector allocation and volatility
    const hasHighVolatilitySectors = holdings.some((stock) =>
      ["Technology", "Automotive", "Financial Services"].includes(stock.sector)
    );
    const bankingAllocation = (sectors["Banking"] || 0) / totalValue;

    let riskLevel = "Low";
    if (hasHighVolatilitySectors && maxSectorAllocation > 0.4) {
      riskLevel = "High";
    } else if (hasHighVolatilitySectors || bankingAllocation < 0.3) {
      riskLevel = "Moderate";
    }

    if(!topPerformer || !worstPerformer){
        return res.statuc(400).json({error: "Unable to find the top/worst performers"})
    }

    const summary = {
      totalValue: Math.round(totalValue),
      totalInvested: Math.round(totalInvested),
      totalGainLoss: Math.round(totalGainLoss),
      totalGainLossPercent,
      topPerformer: {
        symbol: topPerformer.symbol,
        name: topPerformer.companyName,
        gainPercent: parseFloat(topPerformer.gainLossPercent.replace("%", "")),
      },
      worstPerformer: {
        symbol: worstPerformer.symbol,
        name: worstPerformer.companyName,
        gainPercent: parseFloat(
          worstPerformer.gainLossPercent.replace("%", "")
        ),
      },
      diversificationScore: parseFloat(diversificationScore.toFixed(1)),
      riskLevel,
    };

    return res.status(200).json(summary);
  } catch (err) {
    console.error("Error calculating summary: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getHoldings, getAllocations, getPerformance, getSummary };
