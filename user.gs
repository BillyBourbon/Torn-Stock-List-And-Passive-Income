
// 
function getUsersPassiveIncome(tornCall, sheetOptions){
  let userCall = tornApiCall({
    "section" : "user",
    "selections" : [/** "money",*/ "stocks"],
    "apiKey" : apiKey
  })

  // Set Point Cost
  sheetOptions.nonItemValues.points = tornCall.stats.points_averagecost

  // Fill In Rest Of Stock Data
  let stocksObj = mergeUserAndTornStocks(userCall.stocks,tornCall.stocks) 
  let itemsObj = tornCall.items
  let output = []
  
  Object.entries(stocksObj).forEach( ([stockId, stock]) => {
    let { dividend, total_shares, name, acronym, current_price, benefit:{frequency, description} } = stock
    if(!dividend) return
    let value = descriptionToValue(description, itemsObj,sheetOptions) * dividend.increment
    
    let row = [
      `${name} [${acronym}]`,
      description,
      value,
      dividend.increment,
      ((30/frequency) * value),
      (current_price*total_shares)
    ]
  
    output.push(row)
  })

  return output
}

// 
function mergeUserAndTornStocks(userStocks, tornStocks){
  Object.keys(userStocks).forEach( stockId => {
    let { name, acronym, current_price, benefit } = tornStocks[stockId]
    userStocks[stockId].name = name
    userStocks[stockId].acronym = acronym
    userStocks[stockId].current_price = current_price
    userStocks[stockId].benefit = benefit
  })
  return userStocks
}
