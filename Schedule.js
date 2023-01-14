class Schedule {
  constructor(year = new Date().getFullYear(), seperation = 0) {
    this.seperation = seperation
    this.ranges = []
    this.year = year
  }

  /**
   * Builds the final array ready to insert into the Schedule
   *
   * @return {array} The built array
   * @memberof Schedule
   */
  build() {
    const result = []

    for (let property in this) {
      if (!["ranges", "seperation", "year"].includes(property)) {
        const week = this[property]
        const arrayLength = week[0].length

        for (let i = 0; i < this.seperation; i++) {
          week.push(Array(arrayLength))
        }

        result.push(...week)
      }
    }

    return result
  }

  /**
   * Creates a new sheet with the name passed in
   * and builds the headers etc. for a standard schedule
   *
   * @static
   * @param {string} name
   * @return {object} The newly created sheet
   * @memberof Schedule
   */
  static create(name) {
    const sheet = spreadsheet.insertSheet(name)
    const columnWidths = [
      [1, 50],
      [2, 3, 75],
      [5, 400],
      [6, 75],
      [7, 2, 225],
      [9, 8, 75],
    ]

    for (let columnWidth of columnWidths) {
      if (columnWidth.length === 2) {
        sheet.setColumnWidth(columnWidth[0], columnWidth[1])
      } else if (columnWidth.length === 3) {
        sheet.setColumnWidths(columnWidth[0], columnWidth[1], columnWidth[2])
      }
    }

    sheet.setHiddenGridlines(true).setFrozenRows(6)

    sheet.getRange("B5:P6").setFontFamily("Roboto")

    sheet
      .getRange("B2:P2")
      .merge()
      .setFontSize(40)
      .setHorizontalAlignment("right")
      .setValue("Statics 1st Fix")

    sheet
      .getRange("B3:P3")
      .merge()
      .setFontSize(40)
      .setHorizontalAlignment("right")
      .setValue(`${name} Schedule`)

    sheet
      .getRange("B5:P5")
      .setBackground("#674EA7")
      .setBorder(...Array(6).fill(true))
      .setFontColor("white")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")

    sheet.getRange("C5:F5").merge().setValue("Batch Details")

    sheet.getRange("G5:H5").merge().setValue("Required By")

    sheet.getRange("I5:J5").merge().setBackground("blue").setValue("Status")

    sheet
      .getRange("K5:O5")
      .merge()
      .setBackground("#38761D")
      .setValue("Progress")

    sheet
      .getRange("B6:P6")
      .setBackground("#B4A7D6")
      .setBorder(...Array(6).fill(true))
      .setFontColor("#434343")
      .setFontSize(9)
      .setFontWeight("bold")
      .setValues([
        [
          "Week",
          "Batch",
          "Group",
          "Description",
          "Qty",
          "Dispatch",
          "Swift",
          "Launched",
          "Received",
          "Cut",
          "Built",
          "Terminated",
          "Tested",
          "Packed",
          "Vans",
        ],
      ])

    sheet.getRange(`B6:P${sheet.getMaxRows()}`).setHorizontalAlignment("center")

    sheet
      .getRange(`E6:E${sheet.getMaxRows()}`)
      .setHorizontalAlignment("left")
      .setNumberFormat("   @")

    sheet
      .getRange("G6:H6")
      .setHorizontalAlignment("left")
      .setNumberFormat("   @")

    sheet
      .getRange(`G7:H${sheet.getMaxRows()}`)
      .setHorizontalAlignment("left")
      .setNumberFormat("   dddd, dd mmmm yyyy")

    sheet.getRange("I6:J6").setBackground("#9FC5E8")

    sheet.getRange("K6:O6").setBackground("#B6D7A8")

    return sheet
  }

  /**
   * Retrieves batches from 'Live Batches' and groups them by week number
   *
   * @param {boolean} space
   * @return {object} This Schedule for chaining
   * @memberof Schedule
   */
  getBatches() {
    const { scheduleBatches } = getLiveBatches()

    scheduleBatches.forEach((batch) => {
      const year = batch.getYear()
      const week = batch.getWeekNumber()

      if (year === this.year) {
        if (this[week]) batch.push(this[week])
        else this[week] = batch.push([])
      }
    })

    return this
  }

  /**
   * Builds an array of Range start and end rows for use with formatting the schedule
   *
   * @param {number} startRow
   * @returns {array} The array of start/end pairs
   * @memberof Schedule
   */
  getRangeRows(startRow) {
    const ranges = []

    for (let property in this) {
      if (!["ranges", "seperation", "year"].includes(property)) {
        const week = this[property]

        ranges.push([startRow, startRow + week.length - 1])
        startRow += week.length + this.seperation
      }
    }

    return ranges
  }
}
