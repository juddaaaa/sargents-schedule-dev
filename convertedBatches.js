function convertedBatches() {
  return importedBatches().reduce((final, current) => {
    const [
      batch,
      group,
      description,
      qty,
      woCreated,
      woReceived,
      inProgress,
      cut,
      build,
      terminate,
      testPack,
      completed,
      required,
      completedVsRequired
    ] = current

    const {model, length, width, bedrooms} = description
      .match(/^(?<model>[A-Za-z\s\-]+)((?<length>\d{2})x(?<width>\d{2})\/(?<bedrooms>\d{1})b)*/i)
      .groups

    final.push({
      batch,
      model,
      length,
      width,
      bedrooms,
      qty,
      received: woReceived,
      cut,
      built: build,
      terminated: terminate,
      tested: testPack,
      packed: testPack,
      required,
      week: getWeekOfYear(required)
    })

    return final
  }, [])
}