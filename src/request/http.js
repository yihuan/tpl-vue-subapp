
import urls, {BASE_URL} from './api.js'
import qs from 'qs'

const duration = 2500

//特殊请求url：不按统一返回格式的
const specialUrl = [
    urls.projectVips
]

axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

axios.interceptors.request.use(function (config) {
    let moreConfig = {
        crossDomain: true,
    }
    config = Object.assign(config, moreConfig)
    return config
}, function (error) {
    return Promise.reject(error)
})

function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object
}

axios.interceptors.response.use(function(response) {
    let isSpecialRequest = specialUrl.filter(surl => {
        return response.config.url.indexOf(surl) > -1
    })
    if (isSpecialRequest.length > 0) {
        return Promise.resolve(response)
    }
    if (response.status != 200 && response.statusText != 'OK' && !response.config.errorTip) {
        return Promise.reject(response.data)
    }
    // 如果是导出的话返回的值为bolb
    if (response.config.responseType === 'blob' && response.status === 200 && response.statusText === 'OK') {
        return Promise.resolve(response)
    }
    let dataIsObject = isObject(response.data)
    if (!dataIsObject) {
        return Promise.resolve(response.data)
    }
    if (response.data.code === 0) {
        return Promise.resolve(response.data.result)
    } else {
        ELEMENT.Message({
            dangerouslyUseHTMLString: true,
            type: 'error',
            message: response.data.msg,
            duration: duration
        })
        return Promise.reject(response.data)
    }
}, function(error) {
    try {
        let statusCode = error.response && error.response.status
        if (statusCode) {
            switch (statusCode) {
                case 302: {
                    let currentPath = document.location.href.replace('#', 'ione-hash')
                        .replace('?', 'ione-ques')
                        .replace(/=/g, 'ione-eqs')
                        .replace(/&/g, 'ione-and')
                        .replace('https', 'ione-hps')
                        .replace('http', 'ione-hp')
                    location.href = 'https://passport.58corp.com/login?service='
                        + encodeURIComponent(BASE_URL + 'integration/user/login?redirectPage=' + currentPath)
                    break
                }
                case 401:
                    break
                // 请求不存在
                case 404:
                    ELEMENT.Message({
                        dangerouslyUseHTMLString: true,
                        type: 'error',
                        message: '网络请求不存在',
                        duration: duration
                    })
                    break
                case 500:
                    ELEMENT.Message({
                        type: 'error',
                        message: '服务器发生错误，请稍后再试',
                        duration: duration
                    })
                    break
                default:
                    alert(error.response.data)
                    ELEMENT.Message({
                        dangerouslyUseHTMLString: true,
                        type: 'error',
                        message: error.response.data.message,
                        duration: duration
                    })
            }
            return Promise.reject(error.response)
        }
    } catch (error) {
        console.error('Error', error)
    }
})

const CancelToken = axios.CancelToken
const cancellableRequests = {}

export const postRequest = ({
    url,
    tag = '',
    params = {},
    config = {},
    cancellable = false
}) => {
    if (cancellable && cancellableRequests[url]) {
        cancellableRequests[url]()
    }

    if (!url) {
        console.error('Error:', 'Requested URL is empty')
        return
    }
    let realUrl = urls[url] || url
    let defaultConfig = {
        method: 'post',
        url: realUrl + (tag ? `/${tag}` : '') ,
        data: qs.stringify(params),
        cancelToken: new CancelToken(function executor(c){
            if (cancellable) {
                cancellableRequests[url] = c
            }
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencodedcharset=UTF-8'
        }
    }
    config = Object.assign(defaultConfig, {
        errorTip: false
    }, config)
    return axios(config)
}

export const postBodyRequest = ({
    url,
    tag = '',
    params = {},
    config = {},
    cancellable = false
}) => {
    if (cancellable && cancellableRequests[url]) {
        cancellableRequests[url]()
    }

    if (!url) {
        console.error('Error:', 'Requested URL is empty')
        return
    }
    let realUrl = urls[url] || url
    let defaultConfig = {
        method: 'post',
        url: realUrl + (tag ? `/${tag}` : ''),
        data: params,
        cancelToken: new CancelToken(function executor(c) {
            if (cancellable) {
                cancellableRequests[url] = c
            }
        }),
        headers: {
            'Content-Type': 'application/jsoncharset=UTF-8'
        }
    }
    config = Object.assign(defaultConfig, {
        errorTip: false
    }, config)
    return axios(config)
}

export const getRequest = ({
    url,
    tag = "",
    params = {},
    config = {},
    cancellable = false
}) => {
    if (cancellable && cancellableRequests[url]) {
        cancellableRequests[url]()
    }
    if (!url) {
        console.error('Error:', 'Requested URL is empty')
        return
    }
    let realUrl = urls[url] || url
    let defaultConfig = {
        method: 'get',
        params: params,
        cancelToken: new CancelToken(function executor(c) {
            if (cancellable) {
                cancellableRequests[url] = c
            }
        }),
        url: realUrl + (tag ? `/${tag}` : '')
    }
    config = Object.assign(defaultConfig,{
        errorTip: false
    },config)
    return axios(config)
}
