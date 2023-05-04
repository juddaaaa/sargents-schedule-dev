function addConsumerUnits() {
  const spreasheet = SpreadsheetApp.getActive()
  const sheet = spreasheet.getSheetByName('Consumer Units')  
  const existingBatches = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .getValues()
    .flat()

  let currentMaxSerial = sheet
    .getRange(sheet.getLastRow(), 9, 1, 1)
    .getValue()

  const newBatches = filteredBatches().reduce((final, current) => {
    if (!existingBatches.includes(current.batch)) {
      const minSerial = currentMaxSerial + 1
      const maxSerial = (minSerial + current.qty) - 1

      final.push([
        current.batch,
        current.model,
        current.length,
        current.width,
        current.bedrooms,
        current.qty,
        null,
        minSerial,
        maxSerial
      ])

      currentMaxSerial = maxSerial
    }

    return final
  }, [])

  sheet
    .getRange(sheet.getLastRow() + 1, 1, newBatches.length, newBatches[0].length)
    .setValues(newBatches)
}
