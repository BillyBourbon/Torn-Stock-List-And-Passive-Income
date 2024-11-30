
function viewProps(){
  let p = PropertiesService.getScriptProperties()
  p = p.getProperties()
  Object.entries(p).forEach(([x,y])=>console.log(`${x} : ${y}`))
  
  p = PropertiesService.getUserProperties()
  p = p.getProperties()
  Object.entries(p).forEach(([x,y])=>console.log(`${x} : ${y}`))
}
function forceClearProperties(){
  PropertiesService.getScriptProperties().deleteAllProperties()
  PropertiesService.getUserProperties().deleteAllProperties()
}


function setupTriggerToRunBoth(){
  let status = -1
  // 1 : trigger set
  // 0 : trigger already set
  // -1: trigger setup failed
  
  let propKey = "triggerIdRunBoth"
  let functionToRun = "runPassiveIncomeAndTornList"
  let triggerId = PropertiesService.getScriptProperties().getProperty(propKey)
  
  if(triggerId) {
    status = 0
    return status
  }
  console.log(functionToRun)
  try{
    let trigger = ScriptApp.newTrigger(functionToRun).timeBased().everyDays(1).atHour(1).create()
    PropertiesService.getScriptProperties().setProperty(propKey,trigger.getUniqueId())
    this[functionToRun]()
    
    status = 1 
  } catch(e){
    console.log(e)
  }

  return status
}
function deleteTriggerToRunBoth(){
  let status = -1;
  // 1 : trigger deleted
  // 0 : trigger not present
  // -1: trigger not deleted
  
  let propKey = "triggerIdRunBoth"
  let triggerId = PropertiesService.getScriptProperties().getProperty(propKey)
  try{
    let triggers = ScriptApp.getProjectTriggers()
    triggers.forEach(trigger=>{
      if(trigger.getUniqueId().toString() != triggerId) return
      ScriptApp.deleteTrigger(trigger)
      PropertiesService.getScriptProperties().deleteProperty(propKey)
    })
    status = 1
  } catch(e){
    console.log(e)
    status = -1
  }
  console.log(status)
  return status
}

function runPersonalPassiveIncome(tornCall = null){
  if(tornCall == null) {
    tornCall = tornApiCall({
    "section" : "torn",
    "selections" : ["stocks", "items", "stats"],
    "apiKey" : apiKey
  })
  }
  let userPassiveOutput = getUsersPassiveIncome(tornCall, config.userStocks)
  setOutputInSheet(userPassiveOutput, config.userStocks)
  formatSheet(config.userStocks)
}

function runTornStockList(tornCall = null){
  if(tornCall == null) {
    tornCall = tornApiCall({
    "section" : "torn",
    "selections" : ["stocks", "items", "stats"],
    "apiKey" : apiKey
  })
  }
  
  let tornStocksOutput = getTornStocksOutput(tornCall,config.tornStocks)
  setOutputInSheet(tornStocksOutput,config.tornStocks)
  formatSheet(config.tornStocks)
}

function runPassiveIncomeAndTornList(){
  let tornCall = tornApiCall({
    "section" : "torn",
    "selections" : ["stocks", "items", "stats"],
    "apiKey" : apiKey
  })

  runPersonalPassiveIncome(tornCall)

  runTornStockList(tornCall)

}
