/* global window */
import { message } from 'antd'
import axios from 'axios'
import jsonp from 'jsonp'
import cloneDeep from 'lodash.clonedeep'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import pathToRegexp from 'path-to-regexp'
import qs from 'qs'
import { CORS, PROJECT_ID, YQL } from './config'
import { getCurrentSelectedCompanyId, getToken } from './storageManaer'

// 创建一个计数器来跟踪当前进行中的请求数量
let activeRequests = 0
const fetch = (options) => {
    let { method = 'get', data, fetchType, contentType, url } = options // method默认值get

    let clone = cloneDeep(data)
    const cloneData = { ...clone, rnd: Math.random() }

    try {
        let domain = ''
        if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
            [domain] = url.match(/[a-zA-z]+:\/\/[^/]*/)
            url = url.slice(domain.length)
        }
        const match = pathToRegexp.parse(url)
        url = pathToRegexp.compile(url)(data)
        for (let item of match) {
            if (item instanceof Object && item.name in cloneData) {
                delete cloneData[item.name]
            }
        }
        url = domain + url
    } catch (e) {
        message.error(e.message)
    }
    if (fetchType === 'JSONP') {
        return new Promise((resolve, reject) => {
            jsonp(url, {
                param: `${qs.stringify(data)}&callback`,
                name: `jsonp_${new Date().getTime()}`,
                timeout: 10000,
            }, (error, result) => {
                if (error) {
                    reject(error)
                }
                resolve({ statusText: 'OK', status: 200, data: result })
            })
        })
    }

    axios.defaults.withCredentials = true
    axios.defaults.headers.common['platform'] = 1 //web
    if (PROJECT_ID) {
        axios.defaults.headers.common['project-id'] = PROJECT_ID
    }
    axios.defaults.headers.common['Authorization'] = 'Bearer$' + getToken()
    axios.defaults.headers.common['current-selected-company-id'] = getCurrentSelectedCompanyId()
    let strData = contentType && contentType.toLowerCase() === 'json' ? cloneData : qs.stringify(cloneData)
    switch (method.toLowerCase()) {
        case 'get':
            return axios.get(url, {
                params: cloneData,
            })
        case 'delete':
            return axios.delete(url, {
                data: strData,
            })
        case 'post':
            return axios.post(url, strData)
        case 'put':
            return axios.put(url, strData)
        case 'patch':
            return axios.patch(url, strData)
        case 'postfile':
            return axios.post(url, data)
        default:
            return axios(options)
    }
}

export default function request_del(options) {
    // 自动识别跨域请求
    if (options.url && options.url.indexOf('//') > -1) {
        const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
        if (window.location.origin !== origin && options.fetchType!=='JSONP') {
            options.fetchType = 'CORS'
        }
    }
    // 启动 NProgress（进度条）
    if (activeRequests === 0) {
        NProgress.start()
    }
    activeRequests += 1
    NProgress.inc()

    return fetch(options)
        .then((response) => {
            activeRequests -= 1
            if (activeRequests === 0) {
                NProgress.done()
            }
            const { statusText, status } = response
            let data = response.data
            if (data instanceof Array) data = { Data: data }
            if (data.Success === false && data.Message) {
                message.error(data.Message)
            }
            return Promise.resolve({
                success: true,
                message: data.Message || statusText,
                statusCode: status,
                ...data,
            })
        })
        .catch((error) => {
            activeRequests -= 1
            if (activeRequests === 0) {
                NProgress.done()
            }
            const { response } = error
            let msg
            let statusCode
            if (response && response instanceof Object) {
                const { data, statusText } = response
                statusCode = response.status
                msg = data.message || statusText

                if (statusCode === 401) {
                    msg = '登录信息不存在或已过期，请重新登录'
                }
            } else {
                statusCode = 600
                msg = error.message || 'Network Error'
            }

            if (msg === 'Network Error') {
                msg = '请求连接超时'
            }
            return Promise.reject({ success: false, statusCode, message: msg })
        })
}