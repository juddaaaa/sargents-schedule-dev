function updateRemote(batch, field, value) {
  const remote = SpreadsheetApp.openById('1DUvSr106S4z3Y4YwVeQm_uK8TTy5M31rKHvA5HB3s3w')
  const sheet = /^C*R\w+/.test(batch)
    ? remote.getSheetByName('Line 3') : /^C*H\w+/.test(batch)
    ? remote.getSheetByName('Line 7') : null  

  if (sheet) {
    const row = sheet
      .createTextFinder(batch)
      .findNext()
      .getRow()

    const column = sheet
      .getRange('A1:N1')
      .createTextFinder(field)
      .findNext()
      .getColumn()

    sheet.getRange(row, column).setValue(value)
  }
}