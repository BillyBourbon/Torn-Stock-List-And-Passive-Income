
function getTornStocksOutput(tornCall, sheetOptions){
  // Set Point Cost
  sheetOptions.nonItemValues.points = tornCall.stats.points_averagecost
  let stocksObj = tornCall.stocks
  let output = []

  Object.entries(stocksObj).forEach(([stockId,stock])=>{
    let { name, acronym, current_price, total_shares, market_cap, investors, benefit:{ type, frequency, requirement, description } } = stock
    let stockName = `${name} [${acronym}]`
    let marketValue = 0;
    if(type == "active") marketValue = descriptionToValue(description,tornCall.items,sheetOptions)

    let row = [stockName, type, frequency, requirement, description,marketValue, current_price, total_shares, market_cap, investors]
    
    let rois = getRoi(current_price, requirement, frequency, marketValue)
    rois.forEach(roi=>row.push(roi))

    output.push(row)
  })

  return output
}

function getRoi( currentPrice, sharesPerBlock, frequency, marketValue ){
  let rois = []
  let maxIncrement = 4
  let increment = 1

  if(marketValue <= 0) return new Array(maxIncrement).fill("")
  while(increment <= maxIncrement){
    let blockValue = sharesPerBlock * currentPrice
    let roi = (blockValue) / (marketValue/frequency)

    rois.push(`${roi.toFixed(0)} Days`)

    increment ++
    sharesPerBlock *= 2  
  }
  return rois
}
