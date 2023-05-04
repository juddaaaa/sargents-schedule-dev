function onSelectionChange({range}) {
  const sheet = range.getSheet()
  const row = range.getRow()
  const column = range.getColumn()
  const value = range.getValue()

  if (sheet.getSheetName() === 'Weekly') {
    if (row >= 7 && column >= 3 && column <= 16 && value) {
      sheet
        .getRange(7, 3, sheet.getLastRow() - 6, 9)
        .setFontColor(null)
        .setFontWeight(null)
        .setBackground(null)
        .setFontStyle(null)

      sheet
        .getRange(row, 3, 1, 8)
        .setFontColor('white')
        .setFontWeight('bold')
        .setBackground('#674BA6')
        .setFontStyle('italic')
    }
  }
}
