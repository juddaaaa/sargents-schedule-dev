function doGet() {
  const html = HtmlService.createTemplateFromFile('consumerUnits')
  const htmlOutput = HtmlService.createHtmlOutput(html.evaluate())
  htmlOutput.setTitle('View/Update Consumer Units')
  htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1')

  return htmlOutput
}

function showConsumerUnitsSidebar() {
  const html = HtmlService.createTemplateFromFile('consumerUnits')
  const htmlOutput = html.evaluate()
  htmlOutput.setTitle('View/Update Consumer Units')

  SpreadsheetApp.getUi().showSidebar(htmlOutput)
}

function getModels() {
  const spreadsheet = SpreadsheetApp.getActive()
  const sheet = spreadsheet.getSheetByName('Consumer Units')
  const [_, ...data] = sheet.getDataRange().getValues()

  return Array.from(new Set(data.map(row => row[6])))
}

function getConsumerUnits() {
  const spreadsheet = SpreadsheetApp.getActive()
  const sheet = spreadsheet.getSheetByName('Consumer Units')
  const [_, ...data] = sheet.getDataRange().getValues()

  return data.reduce((final, current) => {
    const [
      batch,
      model,
      length,
      width,
      bedrooms,
      qty,
      cuModel,
      cuSerialMin,
      cuSerialMax
    ] = current

    final.push({
      batch,
      model,
      length,
      width,
      bedrooms,
      qty,
      cuModel,
      cuSerialMin,
      cuSerialMax
    })

    return final
  }, [])
}

function updateConsumerUnit(batch, model) {
  const spreadsheet = SpreadsheetApp.getActive()
  const sheet = spreadsheet.getSheetByName('Consumer Units')
  const match = sheet
    .createTextFinder(batch)
    .findNext()

  if (match) {
    const row = match.getRow()
    sheet.getRange(row, 7).setValue(model)
  }

  return 'Function ran'
}