import { message } from 'antd'
import axios from 'axios'

import jsonp from 'jsonp'
import qs from 'qs'

import cloneDeep from 'lodash.clonedeep'
import pathToRegexp from 'path-to-regexp'
import NProgress from 'nprogress'



interface RequestOptions {
	method?: string;
	data?: Record<string, any>; //todo 什么意思
	fetchType?: 'JSONP' | 'CORS';
	contentType?: string;
	url: string;
}

let activeRequests = 0;

const fetch = async (options: RequestOptions) => {
	const { method = 'get', data, fetchType, contentType, url } = options;
	const cloneData = { ...cloneDeep(data), rnd: Math.random() };
	let requestUrl = url;

	// 以http://localhost:8080/animal/dog"为例
	try {
		const domainMatch = requestUrl.match(/[a-zA-z]+:\/\/[^/]*/);
		const domain = domainMatch ? domainMatch[0] : ''; // “http://localhost:8080”
		if (domain) requestUrl = requestUrl.slice(domain.length); // “/animal/dog”

		const match = pathToRegexp.parse(requestUrl); // ["/animal/dog"]
		// 根据解析的路径模板和传入的 data 动态构建最终的 URL。
		requestUrl = pathToRegexp.compile(requestUrl)(data);

		match.forEach(item => {
			if (typeof item === 'object' && item.name in cloneData) {
				delete cloneData[item.name];
			}
		});
		requestUrl = domain + requestUrl;
	} catch (e) {
		message.error((e as Error).message);
	}

	// 处理 axios 请求
	axios.defaults.withCredentials = true // 支持跨域携带 cookie

	// 处理json格式：非json格式的话转换为字符串
	const requestData = contentType?.toLowerCase() === 'json' ? cloneData : qs.stringify(cloneData);
	return axios({
		method,
		url: requestUrl,
		...(method.toLowerCase() === 'get' ? { params: cloneData } : { data: requestData }),
	});
}

const request = async (options: RequestOptions) => {
	if (options.url.includes('//')) {
		const origin = options.url.split('//')[1].split('/')[0];
		if (window.location.origin !== `//${origin}` && options.fetchType !== 'JSONP') {
			options.fetchType = 'CORS';
		}
	}
	// 启动 NProgress 进度条
	if (activeRequests === 0) NProgress.start();
	activeRequests += 1;
	NProgress.inc();

	try {
		const response = await fetch(options);
		activeRequests -= 1;
		if (activeRequests === 0) NProgress.done();

		// todo 与前端对接
		const { statusText, status, data } = response;
		if (Array.isArray(data)) data.Data = data;
		if (data?.Success === false && data.Message) message.error(data.Message);

		return { success: true, message: data?.Message || statusText, statusCode: status, ...data };
	} catch (error: any) {
		activeRequests -= 1;
		if (activeRequests === 0) NProgress.done();

		let msg = 'Network Error';
		let statusCode = 600;
		if (error.response) {
			const { data, statusText } = error.response;
			statusCode = error.response.status;
			msg = data?.message || statusText;
			if (statusCode === 401) msg = '登录信息不存在或已过期，请重新登录';
		}

		if (msg === 'Network Error') msg = '请求连接超时';
		message.error(msg);
		return Promise.reject({ success: false, statusCode, message: msg });
	}

}
export default request;
