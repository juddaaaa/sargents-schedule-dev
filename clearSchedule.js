function clearSchedule() {
  const spreasheet = SpreadsheetApp.getActive()
  const sheet = spreasheet.getSheetByName('Weekly')
  const lastRow = sheet.getLastRow()
  const lastColumn = sheet.getLastColumn()

  if (lastRow >= 7) {
    const range = sheet.getRange(7, 2, lastRow - 6, lastColumn - 1)

    sheet.clearConditionalFormatRules()

    range
      .removeCheckboxes()
      .clear()
  }
}