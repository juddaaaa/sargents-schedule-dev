function filteredBatches() {
  return convertedBatches().filter(batch => batch.required >= getStartOfWeek())
}