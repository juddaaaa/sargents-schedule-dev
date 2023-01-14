function onSelectionChange(e) {
  startTextHighlighting(e)
}

/**
 * Create custom menus when the spreadsheet is opened
 *
 */
function createMenus() {
  const ui = SpreadsheetApp.getUi()

  const consumerUnits = ui
    .createMenu('Consumer Units')
    .addItem('Update', 'updateConsumerUnits')

  const liveBatchData = ui
    .createMenu('Live Batches')
    .addItem('Update', 'updateLiveBatches')

  const weeklySchedule = ui
    .createMenu('Weekly Schedule')
    .addItem('Refresh', 'makeWeeklySchedule')

  ui.createMenu('Statics')
    .addSubMenu(consumerUnits)
    .addSubMenu(liveBatchData)
    .addSubMenu(weeklySchedule)
    .addToUi()
}

/**
 * Updates progress columns in 'Live Batches' when
 * user updates progress columns in 'Weekly'
 *
 * @param {event} e Event passed in by the trigger
 */
function updateLiveBatchProgress(e) {
  const liveBatches = spreadsheet.getSheetByName('Live Batches')
  const liveBatchHeaders = liveBatches
    .getRange(1, 1, 1, liveBatches.getLastColumn())
    .getValues()[0]

  const range = e.range
  const sheet = range.getSheet()

  if (sheet.getName() === 'Weekly') {
    const row = range.getRow()
    const col = range.getColumn()
    const val = range.getValue()
    const field = sheet.getRange(6, col).getValue()

    if (liveBatchHeaders.includes(field)) {
      const batch = sheet.getRange(row, 3).getValue()
      const targetRow = liveBatches.createTextFinder(batch).findNext().getRow()
      const targetCol = liveBatchHeaders.indexOf(field) + 1

      liveBatches.getRange(targetRow, targetCol).setValue(val)

      if (field === 'Packed' && val === 'yes') {
        const completedBatch = new CompletedBatch(
          ...liveBatches.getRange(targetRow, 1, 1, 4).getValues()
        )

        completedBatch.append()
      }
    }
  }
}

/**
 * Updates progress columns in Dean's sheets when
 * user updates progress columns in 'Weekly'
 *
 * @param {event} e Event passed in by the trigger
 */
function updateDeansProgress(e) {
  const liveBatches = spreadsheet.getSheetByName('Live Batches')
  const range = e.range
  const sheet = range.getSheet()

  if (sheet.getName() === 'Weekly') {
    const row = range.getRow()
    const col = range.getColumn()
    const val = range.getValue()
    const batch = sheet.getRange(row, 3).getValue()
    const field = sheet.getRange(6, col).getValue()
    const headerMap = {
      Launched: 5,
      Received: 6,
      Cut: 8,
      Built: 9,
      Terminated: 10,
      Packed: 11,
    }

    const liveBatchRow = liveBatches.createTextFinder(batch).findNext().getRow()

    const completedBatch = new CompletedBatch(
      ...liveBatches.getRange(liveBatchRow, 1, 1, 4).getValues()
    )

    const line = completedBatch.getLine()
    const deansSheet =
      SpreadsheetApp.openById(deansSheetId).getSheetByName(line)

    const deansBatchRow = deansSheet.createTextFinder(batch).findNext().getRow()
    const deansBatchColumn = headerMap[field]

    if (field === 'Launched') {
      deansSheet
        .getRange(deansBatchRow, deansBatchColumn)
        .setValue(val === 'yes' ? 'x' : '')
      return
    }

    if (field === 'Packed') {
      deansSheet
        .getRange(deansBatchRow, 12)
        .setValue(val === 'yes' ? new Date() : '')
    }

    if (field === 'Cut') {
      deansSheet
        .getRange(deansBatchRow, 7)
        .setValue(val === 'yes' ? true : false)
    }

    deansSheet
      .getRange(deansBatchRow, deansBatchColumn)
      .setValue(val === 'yes' ? true : false)
  }
}

/**
 * Sets up text highlighting on the selected row in 'Weekly'
 *
 * @param {event} e Event passed in by the trigger
 */
function startTextHighlighting(e) {
  const range = e.range
  const sheet = range.getSheet()

  if (sheet.getName() === 'Weekly') {
    const col = range.getColumn()
    const row = range.getRow()
    const val = range.getValue()

    if (row >= 7 && col >= 3 && col <= 15 && val !== '') {
      sheet
        .getRange(7, 3, sheet.getLastRow() - 6, sheet.getLastColumn() - 3)
        .setBackground(null)
        .setFontWeight(null)
        .setFontColor(null)

      sheet
        .getRange(row, 3, 1, 6)
        .setBackground('#674EA7')
        .setFontWeight('bold')
        .setFontColor('white')
    }
  }
}
