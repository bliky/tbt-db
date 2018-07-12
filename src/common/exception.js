import { error, login } from './notify';

const is_dev = process.env.NODE_ENV !== 'production';

/*const loginAuth = () => {
  document.getElementById('app').__vue__.$router.push('/login')
}*/
const loginAuth = login

// HTTP请求异常，状态码不等于200
const exceptionHttp = err => {
  is_dev && console.error('[dev]HTTP请求异常: ', err)

  let msg = ''
  let status = err.status || 0
  if (status) {
    switch (status) {
      case 400:
      case '400':
        msg = '[status: ' + status + ', url: ' + err.config.url + ', msg: ' + err.data.message + ']'
        loginAuth()
        break
      case 500:
      case '500':
        msg = '[status: ' + status + ', url: ' + err.config.url + ', msg: ' + err.data.message + ', file: ' + err.data.file + ', line: ' + err.data.line + ']'
        break
      default :
        msg = '[status: ' + status + ', url: ' + err.config.url + ', msg: ' + err.data.message + ']'
        break
    }
  } else {
    msg = '[url: ' + err.config.url + ', msg: ' + err.message + ']'
  }

  error('服务端异常：' + msg)
}

// API接口异常, 状态码等于200, retCode不等于0
const exceptionServices = err => {
  is_dev && console.error('[dev]API调用异常: ', err)

  let retCode = err.data.retCode
  let msg = '[code: ' + retCode + ', url: ' + err.config.url + ', msg: ' + err.data.errMsg + ']'

  switch (retCode) {
    case '1020000': // 未登录
    case 1020000:
      loginAuth()
      break
    case '1040003': // 获取的资源不存在
    case 1040003:
      document.getElementById('app').__vue__.$router.push('/404')
      break
  }

  error('API调用异常:' + msg)
  // router.push({ path: 'login', query: { code: '404' }})
}

// 脚本异常：语法错误 对象不存在
const exceptionScript = err => {
  if (typeof err === 'string') {
    error('自定义异常: ' + err)
  } else {
    let desc = err.toString().split("\n")[0]
    let msg = '[desc: ' + err.name + '|' + err.message + ']'
    error('JS脚本异常：' + msg)
  }
}

export {
  exceptionHttp,
  exceptionServices,
  exceptionScript
}
