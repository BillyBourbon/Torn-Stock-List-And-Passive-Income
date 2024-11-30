// Set Api Key Into Props
function setApiKey(apiKey = ""){
  let isValid = false

  // 
  // Find Then Import Key Verifier Here
  // 
  if(apiKey.length == 16) {
    PropertiesService.getUserProperties().setProperty(`apiKey`, apiKey)
    isValid = true
  }
  return isValid
}

function deleteApiKey(){
  PropertiesService.getUserProperties().deleteProperty("apiKey")
  if(PropertiesService.getUserProperties().getProperty("apiKey")) return false
  else return true
}

// Make Request To TornAPI
function tornApiCall(options){
  let { section, id, selections, apiKey } = options
  if(!id) id = 0
  if(!section) throw Error(`No Section Provided`)
  if(!apiKey) throw Error(`No Apikey Provided`)

  let call = `https://api.torn.com/${section}/${id}?selections=${selections.join(`,`)}&key=${apiKey}`

  let response = UrlFetchApp.fetch(call)
  if(!response.getResponseCode() == 200) throw Error(`Bad Api Call, Section: ${section}, id: ${id}, Selections: ${selections}, ApiKey: ${apiKey}`)
  
  return JSON.parse(response.getContentText())
}

// Turns a torn stock benefit description into an integer value coresponding to the torn cash equivilent
function descriptionToValue(description = "", items = {}, sheetOptions){
  let value, quantity = 0;
  let split = description.split(" ")
    
  try{
  // Handle Items
  if(split[0].includes("x")) {
    quantity = split[0].substring(0,split[0].length - 1)
    let itemName = split.slice(1).join(" ").trim()
    
    // Handle HRG Property As Is Not Torn Item
    if(itemName == "Random Property") {
      value = sheetOptions.nonItemValues.hrg
    } 

    else{
      let { market_value } = Object.values(items).filter(item=>item.name == itemName)[0]
      value = market_value*quantity
    }
  }

  // Handle Money
  if(split[0].includes("$")) {
    value = split[0].split("$")[1]
  }

  // Handle Resource
  if(Object.keys(sheetOptions.nonItemValues).includes(split[1])){
    quantity = split[0]
    value = sheetOptions.nonItemValues[split[1]] * quantity
  }
  }catch{value=0}
  // Yep this definitly works. yourd umb
  try{
    value = Number(value.replace(/,/g,""))
  } catch(e){
    value = Number(value)
  }
  return value
}

// Format the sheet to the super werird config files instructions
function formatSheet(sheetOptions){
  let {formats, sheetName, formatOptions} = sheetOptions.sheet
  let targetSheet = ss.getSheetByName(sheetName)

  if(targetSheet == null) return
  
  if(formatOptions.clearSheetEachTime) targetSheet.getDataRange().clearFormat()
  
  let lastRowTemp = targetSheet.getLastRow()
  let lastColumnTemp = targetSheet.getLastColumn()
  let maxRowTemp = targetSheet.getMaxRows()
  let maxColumnTemp = targetSheet.getMaxColumns()
  if(formatOptions.pad.row) maxRowTemp -=1
  if(formatOptions.pad.column) maxColumnTemp -=1
  
  formats.forEach(formatInfo => {
    let { r1c1, type } = formatInfo
    if(!type || !r1c1) return
    if(r1c1[2] == -1) r1c1[2] = targetSheet.getLastRow() - (r1c1[0]-1)
    if(r1c1[3] == -1) r1c1[3] = targetSheet.getLastColumn() - (r1c1[1]-1)
    if(type == "number"){
      let {format} = formatInfo
      if(r1c1.length == 4){

        if(format.length < r1c1[3]) format = format.concat(new Array(r1c1[3]-format.length).fill(format[format.length-1]))
        format = new Array(r1c1[2]).fill(format)
        targetSheet.getRange(r1c1[0],r1c1[1],r1c1[2],r1c1[3]).setNumberFormats(format)  
      }
      if(r1c1.length == 2)targetSheet.getRange(r1c1[0],r1c1[1]).setNumberFormat(format[0])  
    }
    if(type == "wrap"){
      let {wrap} = formatInfo
      targetSheet.getRange(r1c1[0],r1c1[1],r1c1[2],r1c1[3]).setWrap(wrap)      
    }
    if(type == "alignment"){
      let {alignment, alignmentType} = formatInfo
      targetSheet.getRange(r1c1[0],r1c1[1],r1c1[2],r1c1[3])[`set${alignmentType}Alignment`](alignment)     
    }
    if(type == "boxLengths"){
      let {position, size} = formatInfo 
      if(position == "Column") targetSheet.setColumnWidths(r1c1[1],r1c1[3],size)
      if(position == "Row") targetSheet.setRowHeights(r1c1[0],r1c1[2],size)   
    }
    if(type == "border"){
      let {border:{top, left, bottom, right, vertical, horizontal, color, style}} = formatInfo || null
      targetSheet.getRange(r1c1[0],r1c1[1],r1c1[2],r1c1[3]).setBorder(top, left, bottom, right, vertical, horizontal, color, style)
    }
  })
  if(formatOptions.removeExcessRows){
    if(maxRowTemp - lastRowTemp == 1){
      targetSheet.deleteRow(maxRowTemp)
    }
    if(maxRowTemp - lastRowTemp > 1){
      targetSheet.deleteRows(lastRowTemp+1,maxRowTemp-lastRowTemp)
    }
  }
  if(formatOptions.removeExcessColumns){
    if(maxColumnTemp - lastColumnTemp == 1){
      targetSheet.deleteColumn(maxColumnTemp)
    }
    if(maxColumnTemp - lastColumnTemp > 1){
      targetSheet.deleteColumns(lastColumnTemp+1,maxColumnTemp-lastColumnTemp)
    }
  }
  if(formatOptions.pad){
    if(formatOptions.pad.row){
      targetSheet.insertRowsBefore(1,formatOptions.pad.row)
      targetSheet.setRowHeights(1,formatOptions.pad.row,10)
    }
    if(formatOptions.pad.column){
      targetSheet.insertColumnsBefore(1,formatOptions.pad.column)
      targetSheet.setColumnWidths(1,formatOptions.pad.column,10)
    }  
  }
}

// 
function setOutputInSheet(output, sheetOptions){
  let targetSheetName = sheetOptions.sheet.sheetName
  let targetSheet = ss.getSheetByName(targetSheetName)

  // Is The Sheet A Sheet
  if(!targetSheet){
    // Oh No Lets Fix That
    targetSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(targetSheetName)
  }

  targetSheet.clearContents()
  targetSheet.clearFormats()
  SpreadsheetApp.flush()

  // Set Headers
  sheetOptions.sheet.headers.forEach(headerObj => {
    let { values, r1c1 } = headerObj
    if(typeof(values[0][0]) != "object") values = [values]
    targetSheet.getRange(r1c1[0],r1c1[1], values.length, values[0].length).setValues(values)
  })

  // Set New Content
  targetSheet.getRange(targetSheet.getLastRow()+1,1,output.length,output[0].length).setValues(output) 

  SpreadsheetApp.flush()

}
