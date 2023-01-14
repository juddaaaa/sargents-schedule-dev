/**
 * Adds new batches to 'Live Batches'
 *
 */
function addNewLiveBatches() {
    const startTime = new Date()
    const liveBatches = spreadsheet.getSheetByName('Live Batches')
    const liveBatchData = liveBatches.getDataRange().getValues().slice(1)
    const completedBatches = spreadsheet.getSheetByName('Completed Batches')
    const completedBatchData = completedBatches.getDataRange().getValues().slice(1)

    const checkBatches = [...liveBatchData, ...completedBatchData].map(batch => batch[0]).sort()

    const { liveBatches: allOrders } = getAllOrders()

    backupImportantData()

    const newBatches = allOrders.reduce((acc, cur) => {
        if (!Utils.search(checkBatches, cur.batch, 0, checkBatches.length - 1)) {
            cur.push(acc)
        }

        return acc
    }, [])

    if (newBatches.length) {
        liveBatches
            .getRange(liveBatches.getLastRow() + 1, 1, newBatches.length, newBatches[0].length)
            .setValues(newBatches)

        liveBatches.sort(liveBatches.getLastColumn())
    }

    const endTime = new Date()
    const totalTime = (endTime - startTime) / 1000

    spreadsheet.toast(`Added ${newBatches.length} batch(es) in ${totalTime.toFixed(2)} seconds.`, 'Add New Batches', 10)
}

/**
 * Backup data to a JSON file
 *
 */
function backupImportantData() {
    const liveBatches = spreadsheet.getSheetByName('Live Batches').getDataRange().getValues()

    const completedBatches = spreadsheet.getSheetByName('Completed Batches').getDataRange().getValues()

    const consumerUnits = spreadsheet.getSheetByName('Consumer Units').getDataRange().getValues()

    const backupObject = {
        'Live Batches': liveBatches,
        'Completed Batches': completedBatches,
        'Consumer Units': consumerUnits,
    }

    const backups = DriveApp.getFilesByName('Backup.json')

    if (backups.hasNext()) {
        const backup = backups.next()
        backup.setContent(JSON.stringify(backupObject, null, 2))
    } else {
        DriveApp.createFile('Backup.json', JSON.stringify(backupObject, null, 2))
    }
}

/**
 * Retrieves all the batches from 'All Orders' in Dean's spreadsheet,
 * ready to be used to add new batches to 'Live Batches' and 'Consumer Units'
 *
 * @returns {object} An object containing arrays of 'LiveBatch' and 'ConsumerUnitBatch' objects
 */
function getAllOrders() {
    const spreadsheet = SpreadsheetApp.openById(deansSheetId)

    const allOrders = spreadsheet.getSheetByName('All Orders')
    const ranges = allOrders.getRangeList(['A2:D', 'E2:F', 'H2:K', 'M2:M']).getRanges()

    const [details, status, progress, required] = ranges.map(range =>
        range.getValues().filter(row => row.some(cell => cell !== ''))
    )

    details.forEach((row, index) => row.push(...required[index], ...status[index], ...progress[index]))

    const batches = details.reduce(
        (acc, cur) => {
            acc.liveBatches.push(new LiveBatch(cur))
            acc.consumerUnits.push(new ConsumerUnitBatch(cur.slice(0, 4)))

            return acc
        },
        { liveBatches: [], consumerUnits: [] }
    )

    return batches
}

/**
 * Retrieves all the batches from 'Consumer Units'
 *
 * @returns {array} An array of 'ConsumerUnitBatch' objects
 */
function getConsumerUnits() {
    const consumerUnits = spreadsheet.getSheetByName('Consumer Units')
    const range = consumerUnits
        .getRange('A2:G')
        .getValues()
        .filter(row => row.some(cell => cell !== ''))

    const batches = range.reduce((acc, cur) => {
        acc.push(new ConsumerUnitBatch(cur))

        return acc
    }, [])

    return batches
}

/**
 * Retrieves all the batches from 'Live Batches'
 *
 * @returns {object} An object of 'LiveBatch' and 'ScheduleBatch' arrays
 */
function getLiveBatches() {
    const liveBatches = spreadsheet.getSheetByName('Live Batches')
    const ranges = liveBatches.getRangeList(['A2:D', 'E2:K', 'L2:L']).getRanges()
    const [details, progress, required] = ranges.map(range =>
        range.getValues().filter(row => row.some(cell => cell !== ''))
    )

    details.forEach((row, index) => {
        row.push(...required[index], ...progress[index])
    })

    const batches = details.reduce(
        (acc, cur) => {
            acc.liveBatches.push(new LiveBatch(cur))
            acc.scheduleBatches.push(new ScheduleBatch(cur))

            return acc
        },
        { liveBatches: [], scheduleBatches: [] }
    )

    return batches
}

/**
 * Clear and refresh Weekly Schedule
 *
 */
function makeWeeklySchedule() {
    const weekly = spreadsheet.getSheetByName('Weekly')
    const sched = new Schedule(2023, 1)
    const rangeRows = sched.getBatches().getRangeRows(7)
    const batches = sched.build()
    const cfRules = []

    weekly.setConditionalFormatRules(cfRules)
    weekly.getRange(7, 1, weekly.getMaxRows(), weekly.getMaxColumns()).removeCheckboxes().clear()
    weekly.getRange(7, 2, batches.length, batches[0].length).setValues(batches)

    for (let [start, end] of rangeRows) {
        const statusRule = SpreadsheetApp.newConditionalFormatRule()
            .whenTextContains('yes')
            .setRanges([weekly.getRange(`I${start}:J${end}`)])
            .setBackground('blue')
            .build()

        const progressRule = SpreadsheetApp.newConditionalFormatRule()
            .whenTextContains('yes')
            .setRanges([weekly.getRange(`K${start}:O${end}`)])
            .setBackground('#38761D')
            .build()

        cfRules.push(statusRule, progressRule)

        weekly
            .getRange(`B${start}:B${end}`)
            .merge()
            .setVerticalAlignment('middle')
            .setFontWeight('bold')
            .setFontSize(12)

        weekly
            .getRange(`P${start}:P${end}`)
            .merge()
            .setVerticalAlignment('middle')
            .setFontWeight('bold')
            .setFontSize(12)
            .setFormula(`=SUM(F${start}:F${end})`)

        weekly
            .getRange(`B${start}:P${end}`)
            .setFontFamily('Roboto')
            .setBorder(...Array(6).fill(true), 'black', SpreadsheetApp.BorderStyle.DOTTED)

        weekly
            .getRangeList([`B${start}:D${end}`, `F${start}:F${end}`, `I${start}:P${end}`])
            .setHorizontalAlignment('center')

        weekly.getRangeList([`E${start}:E${end}`, `G${start}:H${end}`]).setHorizontalAlignment('left')
        weekly.getRange(`I${start}:O${end}`).insertCheckboxes('yes', 'no')
    }

    weekly.setConditionalFormatRules(cfRules)
}

/**
 * Update Consumer Units with data from All Orders
 *
 */
function updateConsumerUnits() {
    const startTime = new Date()
    const consumerUnitsSheet = spreadsheet.getSheetByName('Consumer Units')
    let currentMaxSerial = consumerUnitsSheet
        .getRange(consumerUnitsSheet.getLastRow(), consumerUnitsSheet.getLastColumn())
        .getValue()

    // Backup important data
    backupImportantData()

    // Get values from All Orders sheet
    const { consumerUnits: allOrders } = getAllOrders()

    // Get values from Consumer Units sheet and sort by batch in ascending order
    const consumerUnits = getConsumerUnits()
    consumerUnits.sort((a, b) => a.batch.localeCompare(b.batch))

    // Create an array of batch numbers from Consumer Units to use to search for existing batches
    const consumerUnitBatchCheck = consumerUnits.map(batch => batch.batch)

    // Create an array to hold new Consumer Unit Batches
    const newConsumerUnitBatches = []

    // Loop through All Orders and determine wheather batch exists in Consumer Units
    allOrders.forEach(batch => {
        const index = Utils.search(consumerUnitBatchCheck, batch.batch, 0, consumerUnitBatchCheck.length - 1)

        // If batch doesn't exist, add the new batch
        if (!index) {
            batch.getNextSerials(currentMaxSerial)
            batch.push(newConsumerUnitBatches)
            currentMaxSerial = batch.serialMax
        }
    })

    // If new batches exist, append them to Consumer Units sheet
    if (newConsumerUnitBatches.length) {
        consumerUnitsSheet
            .getRange(
                consumerUnitsSheet.getLastRow() + 1,
                1,
                newConsumerUnitBatches.length,
                newConsumerUnitBatches[0].length
            )
            .setValues(newConsumerUnitBatches)
    }

    const endTime = new Date()
    const totalTime = endTime - startTime

    spreadsheet.toast(`Updated Consumer Units in ${totalTime}ms`, 'Update Consumer Units', 10)
}

/**
 * Update Live Batches with data from All Orders
 *
 */
function updateLiveBatches() {
    const startTime = new Date()
    const liveBatchesSheet = spreadsheet.getSheetByName('Live Batches')

    // Backup important data
    backupImportantData()

    // Get values from All Orders sheet
    const { liveBatches: allOrders } = getAllOrders()

    // Get values from Live Batches sheet and sort by batch in ascending order
    const { liveBatches } = getLiveBatches()
    liveBatches.sort((a, b) => a.batch.localeCompare(b.batch))

    // Create an array of batch numbers from Live Batches to use to search for existing batches
    const liveBatchesCheck = liveBatches.map(batch => batch.batch)

    // Create new array to hold updated Live Batches
    const newLiveBatches = []

    // Loop through All Orders and determine wheather batch exists in Live Batches
    allOrders.forEach(batch => {
        const index = Utils.search(liveBatchesCheck, batch.batch, 0, liveBatchesCheck.length - 1)

        // If batch exists, update the batch...
        // ...otherwise add the new batch
        if (index) {
            liveBatches[index] = batch
            liveBatches[index].push(newLiveBatches)
        } else {
            batch.push(newLiveBatches)
        }
    })

    if (newLiveBatches.length) {
        liveBatchesSheet.getRange(2, 1, newLiveBatches.length, newLiveBatches[0].length).setValues(newLiveBatches)
    }

    const endTime = new Date()
    const totalTime = endTime - startTime

    spreadsheet.toast(`Updated Live Batches in ${totalTime}ms`, 'Update Live Batches', 10)
}
