function buildSchedule() {
  const spreasheet = SpreadsheetApp.getActive()
  const sheet = spreasheet.getSheetByName('Weekly')
  const batches = preparedBatches()

  sheet.getRange(7, 2, batches.length, batches[0].length).setValues(batches)

  formatSchedule(weekRanges(batches))
}