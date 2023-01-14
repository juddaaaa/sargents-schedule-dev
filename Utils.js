class Utils {
  static search(array, value, start, end) {
    if (start > end) return false

    let mid = Math.floor((start + end) / 2)

    if (array[mid] === value) return mid

    if (array[mid] > value) {
      return Utils.search(array, value, start, mid - 1)
    } else {
      return Utils.search(array, value, mid + 1, end)
    }
  }
}
