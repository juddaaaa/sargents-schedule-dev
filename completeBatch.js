function completeBatch(batch, model, length, width, bedrooms, qty, completed) {
  const spreadsheet = SpreadsheetApp.getActive()
  const sheet = spreadsheet.getSheetByName('Completed')
  const emptyRow = sheet.getLastRow() + 1
  const existingBatch = sheet
    .createTextFinder(batch)
    .findNext()

  if (!existingBatch) {
    sheet
      .getRange(emptyRow, 1, 1, 7)
      .setValues([[batch, model, length, width, bedrooms, qty, completed]])
  } else {
    sheet
      .getRange(existingBatch.getRow(), 1, 1, 7)
      .setValues([[batch, model, length, width, bedrooms, qty, completed]])
  }
}
