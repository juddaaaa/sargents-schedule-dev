function editTrigger({range, value, oldValue}) {
  const sheet = range.getSheet()
  const row = range.getRow()
  const column = range.getColumn()

  if (sheet.getSheetName() === 'Weekly') {
    const lock = LockService.getScriptLock()
    lock.tryLock(20000)

    if (lock.hasLock()) {
      if (row >= 7 && [11, 12, 13, 14, 15, 16].includes(column) && oldValue) {
        const [batch, model, length, width, bedrooms, qty] = sheet
          .getRange(row, 3, 1, 6)
          .getValues()
          .flat()

        const localField = sheet
          .getRange(6, column)
          .getValue()

        if (localField !== 'Tested') {
          const remoteField = localField === 'Received'
            ? 'WO Received' : localField === 'Cut'
            ? 'Cut' : localField === 'Built'
            ? 'Build' : localField === 'Terminated'
            ? 'Terminate' : localField === 'Packed'
            ? 'Test & Pack' : null

          if (remoteField) {
            updateRemote(batch, remoteField, value)

            if (remoteField === 'Cut') {
              updateRemote(batch, 'In Progress', value)
            }

            if (remoteField === 'Test & Pack') {
              updateRemote(batch, 'Complete', value === 'TRUE' ? new Date() : null)

              if (value === 'TRUE') {
                completeBatch(batch, model, length, width, bedrooms, qty, getFriendlyFormattedDateString(new Date()))
              }
            }
          }
        }
      } else {
        range.setValue(oldValue)
      }

      lock.releaseLock()
    }
  }
}