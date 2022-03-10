import axios from 'axios'
import qs from 'qs'
import Cookies from "js-cookie";
const service = axios.create({
  baseURL: 'http://localhost:8089/',
  timeout: 10000
})

//发送请求之前处理
service.interceptors.request.use(
  config => {
    if (Cookies.get("token")) {
      config.headers['token'] = Cookies.get("token")
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
//请求返回
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      //等于600说明token过期或者token认证失败，需要从新登陆
      if (response.data.code == 600) {
        // 将token删除
        Cookies.set("token", "")
        // 跳转到登录页面
        // window.location.href = "/";
        return response;
      } else {
        return Promise.resolve(response);
      }
    } else {
      return Promise.reject(response);
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