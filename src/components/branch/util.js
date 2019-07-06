export const push = (arr, item) => {
  if (arr.indexOf(item) === -1) {
    arr.push(item)
  }
}

export const remove = (arr, item) => {
  let idx = arr.indexOf(item)
  if (idx !== -1) {
    arr.splice(idx, 1)
  }
}
