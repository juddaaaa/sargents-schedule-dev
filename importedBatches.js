function importedBatches() {
  const remote = SpreadsheetApp.openById('1DUvSr106S4z3Y4YwVeQm_uK8TTy5M31rKHvA5HB3s3w')
  const sheet = 'All Orders'
  const batches = []

  const [_, ...rows] = remote
    .getSheetByName(sheet)
    .getDataRange()
    .getValues()

  batches.push(...rows)

  return batches.sort((a, b) => a[12] - b[12])
}