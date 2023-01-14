class LiveBatch extends Batch {
    constructor(array) {
        super(array)
        this.launched = ['x', 'yes'].includes(array[5]) ? 'yes' : 'no'
        this.received = [true, 'yes'].includes(array[6]) ? 'yes' : 'no'
        this.cut = [true, 'yes'].includes(array[7]) ? 'yes' : 'no'
        this.built = [true, 'yes'].includes(array[8]) ? 'yes' : 'no'
        this.terminated = [true, 'yes'].includes(array[9]) ? 'yes' : 'no'
        this.tested = [true, 'yes'].includes(array[10]) ? 'yes' : 'no'
        this.packed = array[11]
            ? [true, 'yes'].includes(array[11])
                ? 'yes'
                : 'no'
            : [true, 'yes'].includes(array[10])
            ? 'yes'
            : 'no'
    }

    /**
     * Appends a row to 'Live Batches' with the current batch
     *
     * @memberof LiveBatch
     */
    append() {
        const sheet = spreadsheet.getSheetByName('Live Batches')

        if (!this.exists()) {
            sheet.appendRow([
                this.batch,
                this.group,
                this.description,
                this.qty,
                this.launched,
                this.received,
                this.cut,
                this.built,
                this.terminated,
                this.tested,
                this.packed,
                this.timestamp,
            ])

            SpreadsheetApp.flush()
        } else {
            this.update()
        }
    }

    /**
     * Determines wheather a batch exists in 'Live Batches' or 'Completed Batches'
     *
     * @return {boolean} true | false
     * @memberof LiveBatch
     */
    exists() {
        const sheets = [spreadsheet.getSheetByName('Live Batches'), spreadsheet.getSheetByName('Completed Batches')]

        for (let sheet of sheets) {
            if (sheet.createTextFinder(this.batch).findNext()) return true
        }

        return false
    }

    /**
     * Pushes the current batch as an array into the given array
     *
     * @param {array} array
     * @returns {array} The array passed in
     * @memberof LiveBatch
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
            this.launched,
            this.received,
            this.cut,
            this.built,
            this.terminated,
            this.tested,
            this.packed,
            this.timestamp,
        ])

        return array
    }

    /**
     * Updates existing batch in 'Live Batches'
     *
     * @memberof LiveBatch
     */
    update() {
        const sheet = spreadsheet.getSheetByName('Live Batches')
        const row = sheet.createTextFinder(this.batch).findNext().getRow()

        sheet.getRange(row, sheet.getLastColumn()).setValue(this.timestamp)
        SpreadsheetApp.flush()
    }
}
