const info = (msg) => {
    console.log(msg)
}

const success = (msg) => {
  console.log(msg)
}

const warning = (msg) => {
  console.log(msg)
}

const error = (msg) => {
  console.log(msg)
}

const loading = (instance, loadingText) => {
}

const login = () => {
}

const confirm = function (title, content='') {
  return new Promise((resolved, rejected) => {
    this.$vux.confirm.show({
      title,
      content,
      onCancel: rejected,
      onConfirm: resolved
    });
  });
}

export {
  info,
  success,
  warning,
  error,
  login,
  loading,
  confirm
}
