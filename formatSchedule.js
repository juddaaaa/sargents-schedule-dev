function formatSchedule(weekRanges) {
  const spreasheet = SpreadsheetApp.getActive()
  const sheet = spreasheet.getSheetByName('Weekly')
  const lastRow = sheet.getLastRow()

  sheet
    .getRangeList([`B7:C${lastRow}`, `E7:H${lastRow}`, `K7:Q${lastRow}`])
    .setHorizontalAlignment('center')

  sheet
    .getRangeList([`D7:D${lastRow}`, `I7:J${lastRow}`])
    .setNumberFormat('   @')

  for (let [start, finish] of weekRanges) {
    sheet
      .getRange(`B${start}:B${finish}`)
      .merge()
      .setVerticalAlignment('middle')
      .setFontWeight('bold')
      .setFontSize(12)

    sheet
      .getRange(`Q${start}:Q${finish}`)
      .merge()
      .setVerticalAlignment('middle')
      .setFontWeight('bold')
      .setFontSize(12)
      .setFormula(`=SUM(H${start}:H${finish})`)

    sheet
      .getRange(`K${start}:P${finish}`)
      .insertCheckboxes()

    sheet.setConditionalFormatRules([
      ...sheet.getConditionalFormatRules(),
      SpreadsheetApp
        .newConditionalFormatRule()
        .whenTextContains('TRUE')
        .setRanges([sheet.getRange(`K${start}:K${finish}`)])
        .setBackground('blue')
        .build(),
      SpreadsheetApp
        .newConditionalFormatRule()
        .whenTextContains('TRUE')
        .setRanges([sheet.getRange(`L${start}:L${finish}`)])
        .setBackground('red')
        .build(),
      SpreadsheetApp
        .newConditionalFormatRule()
        .whenTextContains('TRUE')
        .setRanges([sheet.getRange(`M${start}:M${finish}`)])
        .setBackground('#FF7600')
        .build(),
      SpreadsheetApp
        .newConditionalFormatRule()
        .whenTextContains('TRUE')
        .setRanges([sheet.getRange(`N${start}:N${finish}`)])
        .setBackground('orange')
        .build(),
      SpreadsheetApp
        .newConditionalFormatRule()
        .whenTextContains('TRUE')
        .setRanges([sheet.getRange(`O${start}:O${finish}`)])
        .setBackground('#FFCB00')
        .build(),
      SpreadsheetApp
        .newConditionalFormatRule()
        .whenTextContains('TRUE')
        .setRanges([sheet.getRange(`P${start}:P${finish}`)])
        .setBackground('#38761D')
        .build()
    ])

    sheet
      .getRange(`B${start}:Q${finish}`)
      .setBorder(...Array(6).fill(true), 'grey', SpreadsheetApp.BorderStyle.DOTTED)
  }
}