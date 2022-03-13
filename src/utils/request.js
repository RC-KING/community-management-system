import axios from 'axios'
import qs from 'qs'
import { getToken, getTokenTime, removeSession, removeToken, removeTokenTime, removeUserId, setToken, setTokenTime } from '../utils/auth'
import { refreshTokenApi } from '../api/user'
const service = axios.create({
  baseURL: 'http://localhost:8089/',
  timeout: 10000
})
// 刷新token
function refreshToken() {
  const param = {
    token: getToken()
  }
  return refreshTokenApi(param).then(res => res.data)
}
var isRefresh = false
//发送请求之前处理
service.interceptors.request.use(
  config => {
    // 如果能够获取到token,就将token添加到所有的request的头中
    if (getToken()) {
      config.headers.token = getToken()
    }
    // 获取当前系统时间戳
    const currentTime = new Date().getTime()
    // 获取过期时间
    const expireTime = getTokenTime()
    if (expireTime > 0) {
      // 计算剩余的时间(单位:分钟)
      const leftTime = (expireTime - currentTime) / 1000 / 60
      console.log('token剩余时间', leftTime)
      // 如果还剩3分钟过期,就刷新token
      if (leftTime < 3) {
        // 如果刷新过了就不进来
        if (!isRefresh) {
          isRefresh = true
          // 把设置好头部的config返回
          return refreshToken().then(res => {
            if (res.code === 200) {
              // 把新的token和过期时间重新设置
              setToken(res.data.token)
              setTokenTime(res.data.expireTime)
              // 把新的token设置进入头部
              config.headers.token = getToken()
            }
            return config
          })
            .catch(res => { console.log(res) })
            .finally(() => { isRefresh = false })
        }
      }
    }

    return config
  }, error => {
    return Promise.reject(error)
  })
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      // 等于600说明token过期或者token认证失败，需要从新登陆
      // 这个600需要和后端协商
      if (response.data.code === 600) {
        removeToken()
        removeUserId()
        removeSession()
        removeTokenTime()
        // 跳转到登录页面进行重新登录获取token
        window.location.href = '/'
        return response
      } else {
        return Promise.resolve(response)
      }
    } else {
      return Promise.reject(response)
    }
  }, error => {
    return Promise.reject(error.response.data)
  })

//请求方法
const http = {
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  patch(url, params) {
    return service.patch(url, params, {
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // 这个是普通风格的get请求
  // parm =>  {id:10}
  // http://localhost:8089/api/user?id=10
  get(url, params) {
    return service.get(url, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      }
    })
  },
  // 这个是Restful风格的get请求
  // parm =>  {id:10}
  // http://localhost:8089/api/user/10
  getRestApi(url, params) {
    let _params
    if (Object.is(params, undefined || null)) {
      _params = ''
    } else {
      _params = '/'
      for (const key in params) {
        console.log(key)
        console.log(params[key])
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
          _params += `${params[key]}/`
        }
      }
      // 去掉参数最后一位?
      _params = _params.substr(0, _params.length - 1)
    }
    console.log(_params)
    if (_params) {
      return service.get(`${url}${_params}`)
    } else {
      return service.get(url)
    }
  },

  // parm =>  {id:10}
  // http://localhost:8089/api/user/10
  delete(url, params) {
    let _params
    if (Object.is(params, undefined || null)) {
      _params = ''
    } else {
      _params = '/'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
          _params += `${params[key]}/`
        }
      }
      // 去掉参数最后一位?
      _params = _params.substr(0, _params.length - 1)
    }
    if (_params) {
      return service.delete(`${url}${_params}`).catch(err => {
        return Promise.reject(err)
      })
    } else {
      return service.delete(url).catch(err => {
        return Promise.reject(err)
      })
    }
  },
  // 强制以form表单形式提交
  login(url, params) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return qs.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  // 获取验证
  getImage(url) {
    return service.post(url, null, {
      responseType: 'arraybuffer'
    })
  }
}
export default http