function openTrigger() {
  const ui = SpreadsheetApp.getUi()
  const spreadsheet = SpreadsheetApp.getActive()
  const sheet = spreadsheet.getSheetByName('Weekly')

  sheet
    .getDataRange()
    .setFontFamily('Roboto')

  ui.createMenu('Functions')
    .addItem('Add New Consumer Units', 'addConsumerUnits')
    .addItem('Refresh Schedule', 'refreshSchedule')
    .addItem('View/Update Consumer Units', 'showConsumerUnitsSidebar')
    .addToUi()
}