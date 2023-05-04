function weekRanges(array) {
  const groupsArray = array.reduce((final, current, index) => {
    if (current.every(cell => cell === '')) {
      final[final.length - 1].push(index + 6)
      final.push([(index + 6) + 2])
    }

    return final
  }, [[7]])

  groupsArray[groupsArray.length - 1].push(array.length + 6)

  return groupsArray
}