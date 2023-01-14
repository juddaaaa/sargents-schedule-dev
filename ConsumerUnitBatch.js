class ConsumerUnitBatch extends Batch {
  constructor(array) {
    super([...array.slice(0, 4), new Date()])
    this.model = array[4] || ''
    this.serialMin = array[5] || 0
    this.serialMax = array[6] || 0
  }

  /**
   * Appends a row to 'Consumer Units' with the current batch
   *
   * @memberof ConsumerUnitBatch
   */
  append() {
    const sheet = spreadsheet.getSheetByName('Consumer Units')

    if (!this.exists()) {
      this.getNextSerials()

      sheet.appendRow([
        this.batch,
        this.group,
        this.description,
        this.qty,
        this.model,
        this.serialMin,
        this.serialMax,
      ])

      SpreadsheetApp.flush()
    }
  }

  /**
   * Determines wheather a batch exists in 'Consumer Units'
   *
   * @return {boolean} true | false
   * @memberof ConsumerUnitBatch
   */
  exists() {
    const sheet = spreadsheet.getSheetByName('Consumer Units')

    if (sheet.createTextFinder(this.batch).findNext()) return true

    return false
  }

  /**
   * Sets the  Consumer Unit serial numbers for this batch
   *
   * @memberof ConsumerUnitBatch
   */
  getNextSerials(currentMax) {
    if (!currentMax) {
      const sheet = spreadsheet.getSheetByName('Consumer Units')
      const currentMax = sheet
        .getRange(sheet.getLastRow(), sheet.getLastColumn())
        .getValue()
    }

    this.serialMin = currentMax + 1
    this.serialMax = this.serialMin + this.qty - 1
  }

  /**
   * Pushes the current batch as an array into the given array
   *
   * @param {array} array
   * @returns {array} The array passed in
   * @memberof ConsumerUnitBatch
   */
  push(array) {
    if (!Array.isArray(array)) {
      throw new Error("Parameter 'array' must be an Array")
    }

    array.push([
      this.batch,
      this.group,
      this.description,
      this.qty,
      this.model,
      this.serialMin,
      this.serialMax,
    ])

    return array
  }
}
