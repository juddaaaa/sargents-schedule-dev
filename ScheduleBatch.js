class ScheduleBatch extends LiveBatch {
  constructor(array) {
    super(array)
    this.timestamp2 = this.addDays(3)
  }

  /**
   * Adds the given number of workdays to the
   * timestamp property of the current batch
   *
   * @param {number} numDays
   * @return {date} New date with the given number of days added
   * @memberof ScheduleBatch
   */
  addDays(numDays) {
    const timestamp = new Date(this.timestamp)

    while (numDays > 0) {
      timestamp.setTime(timestamp.getTime() + 1000 * 60 * 60 * 24)

      if (timestamp.getDay() === 0 || timestamp.getDay() === 6) continue
      numDays--
    }

    return timestamp
  }

  /**
   * TODO
   *
   * @memberof ScheduleBatch
   */
  append() {
    return
  }

  /**
   * Pushes the current batch as an array into the given array
   *
   * @param {array} array
   * @returns {array} The array passed in
   * @memberof ScheduleBatch
   */
  push(array) {
    if (!Array.isArray(array)) {
      throw new Error("Parameter 'array' must be an Array")
    }

    const formattedDates = this.getFormattedDates()

    array.push([
      this.getWeekNumber(),
      this.batch,
      this.group,
      this.description,
      this.qty,
      formattedDates[0],
      formattedDates[1],
      this.launched,
      this.received,
      this.cut,
      this.built,
      this.terminated,
      this.tested,
      this.packed,
    ])
    
    return array
  }
}
