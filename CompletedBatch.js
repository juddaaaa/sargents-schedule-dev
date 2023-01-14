class CompletedBatch extends Batch {
  constructor(array) {
    super([...array, new Date()])
  }

  /**
   * Appends a row to 'Completed Batches' with the current batch
   *
   * @memberof CompletedBatch
   */
  append() {
    const sheet = spreadsheet.getSheetByName('Completed Batches')

    if (!this.exists()) {
      sheet.appendRow([
        this.batch,
        this.group,
        this.description,
        this.qty,
        this.timestamp,
      ])

      SpreadsheetApp.flush()
    } else {
      this.update()
    }
  }

  /**
   * Determines wheather a batch exists in 'Completed Batches'
   *
   * @return {boolean} true | false
   * @memberof CompletedBatch
   */
  exists() {
    const sheet = spreadsheet.getSheetByName('Completed Batches')

    if (sheet.createTextFinder(this.batch).findNext()) return true

    return false
  }

  /**
   * Pushes the current batch as an array into the given array
   *
   * @param {array} array
   * @returns {array} The array passed in
   * @memberof CompletedBatch
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
      this.timestamp,
    ])

    return array
  }

  /**
   * Updates existing batch in 'Completed Batches'
   *
   * @memberof CompletedBatch
   */
  update() {
    const sheet = spreadsheet.getSheetByName('Completed Batches')
    const row = sheet.createTextFinder(this.batch).findNext().getRow()
    const batch = this.push([])

    sheet.getRange(row, 1, 1, batch[0].length).setValues(batch)
    SpreadsheetApp.flush()
  }
}
