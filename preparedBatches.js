function preparedBatches(filtered = true) {
  const batches = filtered ? filteredBatches() : convertedBatches()
  return batches.reduceRight((final, current, index, array) => {
    const {
      batch,
      model,
      length,
      width,
      bedrooms,
      qty,
      received,
      cut,
      built,
      terminated,
      tested,
      packed,
      required,
      week
    } = current

    final.unshift([
      week,
      batch,
      model,
      length,
      width,
      bedrooms,
      qty,
      getFriendlyFormattedDateString(required),
      getFriendlyFormattedDateString(addWorkdays(3, required)),
      received,
      cut,
      built,
      terminated,
      tested,
      packed
    ])

    if (index > 0 && array[index - 1].week !== week) {
      final.unshift(Array(15))
    }

    return final
  }, [])
}