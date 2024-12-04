// Find a better way at somepoint
const ss = SpreadsheetApp.getActiveSpreadsheet()

let apiKey = PropertiesService.getUserProperties().getProperty(`apiKey`)

const config = 
{
  "tornStocks" : {
    "sheet" : {
      "sheetName" : "Torn Stock List",
      "headers" : [
        {"values" : ["Stock Name", "Bonus Block Type", "Bonus Block Frequency","Shares Needed Per Block", "Bonus Block Payout", "Estimated Market Value", "Current Price", "Increment 1 ROI", "Increment 2 ROI", "Increment 3 ROI", "Increment 4 ROI" ], "r1c1" : [1,1]}
      ],
      "formatOptions" : {
        "clearSheetEachTime" : true,
        "removeExcessColumns" : true,
        "removeExcessRows" : true,
        "pad":{
          "row" : 1,
          "column"  : 1
        }
      },
      "formats":[
        {
          "type":"number", 
          "r1c1":[1,1,-1,-1], 
          "format": 	[ '0.###############','#,##0;(#,##0)','#,##0;(#,##0)','#,##0;(#,##0)','"$"#,##0','"$"#,##0','"$"#,##0','#,##0;(#,##0)','"$"#,##0','#,##0;(#,##0)' ]
        },
        {
          "type":"wrap", 
          "r1c1":[1,1,-1,-1], 
          "wrap": true
        },
        {
          "type":"alignment", 
          "r1c1":[1,1,-1,-1],
          "alignmentType" : "Vertical",
          "alignment" : "Middle" 
        },
        {
          "type":"alignment", 
          "r1c1":[1,1,-1,-1],
          "alignmentType" : "Horizontal", 
          "alignment" : "Center" 
        },
        {
          "type" : "boxLengths", 
          "r1c1" : [1,1,-1,-1],
          "position" : "Column",
          "size" : 175
        },
        {
          "type" : "boxLengths", 
          "r1c1" : [1,1,-1,-1],
          "position" : "Row",
          "size" : 35
        },
        {
          "type":"border", 
          "r1c1":[1,1,-1,-1], 
          "border" : {
            "top" : true,
            "bottom" : true,
            "left" : true,
            "right" : true,
            "style" : SpreadsheetApp.BorderStyle.DOUBLE
          }
        },
        {
          "type":"border", 
          "r1c1":[2,1,-1,-1], 
          "border" : {
            "horizontal" : true,
            "vertical" : true,
            "style" : SpreadsheetApp.BorderStyle.DASHED
          }
        },
        {
          "type":"border", 
          "r1c1":[1,1,1,-1], 
          "border" : {
            "bottom" : true,
            "style" : SpreadsheetApp.BorderStyle.DOUBLE
          }
        },
      ]

    },
    "nonItemValues" : {
      "energy" : 120000,
      "nerve" : 1000,
      "points" : 45000,
      "happiness" : 1000,
      "hrg" : 50000000
    }
  },
  "userStocks" : {
    "sheet" : {
      "sheetName" : "Personal Passive Income",
      "headers" : [
        {"values" : ["Estimated Monthly Passive Income","=SUM($E$3:$E)"], "r1c1" : [1,3]},
        {"values" : ["Stock Name", "Item Given",	"Est Market Value",	"# of Blocks",	"Monthly Income",	"Cost of Stocks"], "r1c1" : [2,1]}
      ],
      "formatOptions" : {
        "clearSheetEachTime" : true,
        "removeExcessColumns" : true,
        "removeExcessRows" : true,
        "pad":{
          "row" : 1,
          "column"  : 1
        }
      },
      "formats" :[
        {
          "type":"number", 
          "r1c1":[1,4], 
          "format": [ '"$"#,##0']
          },
        {
          "type":"number", 
          "r1c1":[3,1,-1,-1], 
          "format": 	[ '0.###############','"$"#,##0','"$"#,##0','#,##0;(#,##0)','"$"#,##0','"$"#,##0' ]
        },
        {
          "type":"border", 
          "r1c1":[1,3,1,2], 
          "border" : {
            "top" : true,
            "bottom" : true,
            "left" : true,
            "right" : true,
            "style" : SpreadsheetApp.BorderStyle.DOUBLE
          }
        },
        {
          "type":"border", 
          "r1c1":[1,3,1,2], 
          "border" : {
            "vertical" : true,
            "style" : SpreadsheetApp.BorderStyle.DASHED
          }
        },
        {
          "type":"border", 
          "r1c1":[2,1,-1,-1], 
          "border" : {
            "top" : true,
            "bottom" : true,
            "left" : true,
            "right" : true,
            "style" : SpreadsheetApp.BorderStyle.DOUBLE
          }
        },
        {
          "type":"border", 
          "r1c1":[3,1,-1,-1], 
          "border" : {
            "horizontal" : true,
            "vertical" : true,
            "style" : SpreadsheetApp.BorderStyle.DASHED
          }
        },
        {
          "type":"border", 
          "r1c1":[2,1,1,-1], 
          "border" : {
            "bottom" : true,
            "style" : SpreadsheetApp.BorderStyle.DOUBLE
          }
        },
        {
          "type":"wrap", 
          "r1c1":[1,1,-1,-1], 
          "wrap": true
        },
        {
          "type":"alignment", 
          "r1c1":[1,1,-1,-1],
          "alignmentType" : "Vertical",
          "alignment" : "Middle" 
        },
        {
          "type":"alignment", 
          "r1c1":[1,1,-1,-1],
          "alignmentType" : "Horizontal", 
          "alignment" : "Center" 
        },
        {
          "type" : "boxLengths", 
          "r1c1" : [1,1,-1,-1],
          "position" : "Column",
          "size" : 175
        },
        {
          "type" : "boxLengths", 
          "r1c1" : [1,1,-1,-1],
          "position" : "Row",
          "size" : 35
        }
      ]
    },
    "nonItemValues" : {
      "energy" : 120000,
      "nerve" : 1000,
      "points" : 45000,
      "happiness" : 1000,
      "hrg" : 50000000
    }
  }
}
