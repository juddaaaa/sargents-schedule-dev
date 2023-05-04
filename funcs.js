const { addWorkdays, getStartOfWeek, getWeekOfYear, getFriendlyFormattedDateString } = DateTools

function refreshSchedule() {
  const spreadsheet = SpreadsheetApp.getActive()
  const sheet = spreadsheet.getSheetByName('Weekly')

  clearSchedule()
  buildSchedule()

  sheet
    .getDataRange()
    .setFontFamily('Roboto')
}

// function transferConsumerUnits() {
//   const localSS = SpreadsheetApp.getActive()
//   const remoteSS = SpreadsheetApp.openById('17xBfGiB895Ie6O1-fJwkWnZKAEUczCAlc3eNYFj8p4w')
//   const oldSheet = remoteSS.getSheetByName('Consumer Units')
//   const newSheet = localSS.getSheetByName('New Consumer Units')
//   const [_, ...oldData] = oldSheet.getDataRange().getValues()

//   const newData = oldData.reduce((final, current) => {
//     const {model, length, width, bedrooms} = current[2]
//       .match(/^(?<model>[A-Za-z\s\-]+)((?<length>\d{2})x(?<width>\d{2})\/(?<bedrooms>\d{1})b)*/)
//       .groups

//     final.push([
//       current[0],
//       model,
//       length,
//       width,
//       bedrooms,
//       current[3],
//       current[4],
//       current[5],
//       current[6]
//     ])

//     return final
//   }, [])

//   newSheet
//     .getRange(2, 1, newData.length, newData[0].length)
//     .setValues(newData)
// }