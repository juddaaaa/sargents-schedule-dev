class Batch {
  constructor(array) {
    this.batch = array[0]
    this.group = array[1]
    this.description = array[2]
    this.qty = array[3]
    this.timestamp = array[4]
  }

  /**
   * Format timestamps into human readable string
   *
   * @return {string | array} String or array of strings depending on number of timestamps
   * @memberof Batch
   */
  getFormattedDates() {
    const timestampSuffix = Batch.getSuffix(this.timestamp.getDate())
    const timestamp2Suffix =
      "timestamp2" in this ? Batch.getSuffix(this.timestamp2.getDate()) : null

    if (!timestamp2Suffix) {
      return Utilities.formatDate(
        this.timestamp,
        "GMT",
        `EEEE d'${timestampSuffix}' MMMM yyyy`
      )
    }

    return [
      Utilities.formatDate(
        this.timestamp,
        "GMT",
        `   EEEE d'${timestampSuffix}' MMMM yyyy`
      ),
      Utilities.formatDate(
        this.timestamp2,
        "GMT",
        `   EEEE d'${timestamp2Suffix}' MMMM yyyy`
      ),
    ]
  }

  /**
   * Generates the Swift line number based on
   * which letter the Batch number starts with
   *
   * @memberof Batch
   * @returns {string | null} The line number or null
   */
  getLine() {
    const start = this.batch.substring(0, 2)

    return start.includes("R")
      ? "Line 3"
      : start.includes("H")
      ? "Line 7"
      : null
  }

  /**
   * Generates a suffix for the day of month passed in
   *
   * @static
   * @param {*} dayNumber
   * @return {string} The suffix
   * @memberof Batch
   */
  static getSuffix(dayNumber) {
    switch (dayNumber) {
      case 1:
      case 21:
      case 31:
        return "st"
      case 2:
      case 22:
        return "nd"
      case 3:
      case 23:
        return "rd"
      default:
        return "th"
    }
  }

  /**
   * Retrieves the week number of this batch
   *
   * @return {number} The week number
   * @memberof Batch
   */
  getWeekNumber() {
    return Utilities.formatDate(this.timestamp, "GMT", "w")
  }

  /**
   * Retrieves the yaer of this batch
   *
   * @return {number} The year
   * @memberof Batch
   */
  getYear() {
    return this.timestamp.getFullYear()
  }

  /**
   * Determines wheather all the required fields are of valid types
   *
   * @memberof Batch
   * @returns {boolean} true | false
   */
  isValid() {
    if (typeof this.batch !== "string") return false
    if (typeof this.group !== "string") return false
    if (typeof this.description !== "string") return false
    if (typeof this.qty !== "number") return false
    if (!this.timestamp instanceof Date) return false
    
    return true
  }

  /**
   * Console logs the current object
   *
   * @memberof Batch
   */
  print() {
    console.log(this)
  }
}
