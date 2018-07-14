const buildQuery = obj => {
  let q = [];
  for (let k in obj) {
    q.push(k+'='+obj[k]);
  }
  if (!q.length) return '';

  return q.join('&');
}

export {
  buildQuery
}
