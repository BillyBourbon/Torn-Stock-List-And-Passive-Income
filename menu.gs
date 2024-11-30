let ui
try{
  ui = SpreadsheetApp.getUi()
} catch{
  ui = null
}
function subMenusArray(){
  const subMenuSettings = ui.createMenu("Script Settings")
  .addItem("Set Api Key", "menuButtonSetApiKey")
  .addItem("Delete Api Key", "menuButtonDeleteApiKey")

  const subMenuAutomaticRun = ui.createMenu("Run Scripts Automatically")
  .addItem("Get Personal Passive Income And Torns Stock List Daily",`menuButtonSetupTriggerToRunBoth`)
  .addItem("Deactivate All Triggers",`deleteTriggerToRunBoth`)

  const subMenuManualRun = ui.createMenu("Run Script Manually")
  .addItem("Get Personal Passive Stock Income","menuButtonRunPersonalPassiveIncome")
  .addItem("Get Torn Stock List","menuButtonRunTornStockList")
  .addItem("Run Both","menuButtonRunPassiveIncomeAndTornList")

  let subMenus = [ subMenuSettings, subMenuAutomaticRun, subMenuManualRun ]

  return subMenus
}

// 
function onOpen(e){
  let sheetMenu = ui.createMenu("Script")

  const subMenus = subMenusArray()

  subMenus.forEach(subMenu=>{
    sheetMenu.addSubMenu(subMenu)
    if( subMenu != subMenus[subMenus.length - 1] ) sheetMenu.addSeparator()
  })
  sheetMenu.addToUi()
}

function menuButtonSetupTriggerToRunBoth(){
  let msgBoxText;
  let msgBoxTitle = "Setup Triggers"
  // 
  // 
  //    CHECK ACCCESS LEVEL REQUIRED
  // 
  let apiKey = PropertiesService.getUserProperties().getProperty("apiKey")
  if(apiKey == null || apiKey.length != 16) msgBoxText = "No API Key Set. Please Set One Of Limited Access"
  // 
  //    CHECK ACCCESS LEVEL REQUIRED
  // 
  // 
  else{
    let isSetup = setupTriggerToRunBoth()

    if(isSetup == -1) msgBoxText = "Trigger Failed To Be Setup"
    if(isSetup == 0) msgBoxText = "Trigger Already Setup"
    if(isSetup == 1) msgBoxText = "Trigger Setup"
  }
  
  return ui.alert(msgBoxTitle,msgBoxText,ui.ButtonSet.OK)
}

function menuButtonSetApiKey(){
  let msgBoxTitle = "Set API Key"
  let msgBoxApiKey = ui.prompt(msgBoxTitle,"Enter API Key",ui.ButtonSet.OK_CANCEL)
  
  if(msgBoxApiKey.getSelectedButton() != ui.Button.OK) return ui.alert(msgBoxTitle,"Cancelling Setting Of API Key",ui.ButtonSet.OK)
  
  if(setApiKey(msgBoxApiKey.getResponseText())) return ui.alert("API Key Set Succesfully")
  else return ui.alert("API Key Unsuccesfully Set")
}

function menuButtonDeleteApiKey(){
  let msgBoxTitle = "Delete API Key"
  
  let msgBoxApiKeyDeleteConfirmation = ui.alert(msgBoxTitle,"Are You Sure You Wish To Delete The API Key?",ui.ButtonSet.YES_NO)
  
  if(msgBoxApiKeyDeleteConfirmation == ui.Button.YES) {
    let isDeleted = deleteApiKey()
    if(isDeleted) return ui.alert(msgBoxTitle,"API Key Sucessfully Deleted",ui.ButtonSet.OK)
  }
  
  return ui.alert(msgBoxTitle,"Cancelled API Key Deletion",ui.ButtonSet.OK)
}

function menuButtonRunPersonalPassiveIncome(){
  let msgBoxTitle = "Personal Passive Stock Income"
  try{
    runPersonalPassiveIncome() 
    ui.alert(msgBoxTitle, "Succesfully Pulled Passive Income.",ui.ButtonSet.OK)
  } catch{
    ui.alert(msgBoxTitle, "Passive Income Was Unsuccessful",ui.ButtonSet.OK)
  }
}

function menuButtonRunTornStockList(){
  let msgBoxTitle = "Torn Stock List"
  try{
    runTornStockList() 
    ui.alert(msgBoxTitle, "Succesfully Pulled Torns Stock List.",ui.ButtonSet.OK)
  } catch{
    ui.alert(msgBoxTitle, "Torn Stock List Was Unsuccessful",ui.ButtonSet.OK)
  }
}

function menuButtonRunPassiveIncomeAndTornList(){
  let msgBoxTitle = "Stock List And Passive Income"
  try{
    runPassiveIncomeAndTornList()
    ui.alert(msgBoxTitle, "Succesfully Pulled Torns Stock List And Passive Income.",ui.ButtonSet.OK)
  } catch{
    ui.alert(msgBoxTitle, "Script Was Unsuccessful",ui.ButtonSet.OK)
  }
}
