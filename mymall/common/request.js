import store from '@/store'
import cache from './cache'  // get 取 ，put 存 本地存储的封装
import {
	msg    //  包含  uni.showToast() 提示算法封装
} from './util'
const key = 'secret';
const domain = 'http://localhost:3000/api/'; // https://www.xiaoxiao.com
/* 
const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
    dev:{
        baseApi:'http://localhost:3000/api/'
    },
    prod:{
        baseApi:'http://www.xiaoxiao.com:3000/api/'
    }
	
	EnvConfig[env]
} */
export const request = function(urlOp, data ={}, ext={},method = 'get') {
		return new Promise(function(resolve, reject) {
			const moduleName = urlOp;
			// 判断有缓存读缓存。
			if(ext.cache > 0){
				
				const cacheResult = cache.get(moduleName);
				if(cacheResult !== false){
					resolve(cacheResult);
					return;
				}
			}
			let header = {  // 没token 的编码
				'content-type': 'application/x-www-form-urlencoded'
			}
			let token =  cache.get('token');
			if (token) {
				header = {
					'authorization': token,  // Authorization 向服务传递token 
					'content-type': 'application/x-www-form-urlencoded'
				}
			}
			uni.request({
				url: domain + urlOp,
				data: data,
				method: method,
				header,
				success: (res) => {
					if (res.data.code == 801 || res.data.code == 802) { // 没 token 返回 801 ， token 过期  返回 802
					    msg('登录信息已过期，请重新登录');
					    //store.commit('logout');
					    reject('无效的登录信息');
					    return;
					} else {
						if(ext.cache > 0){
							// 接口缓存
							cache.put(moduleName, res.data, ext.cache);
						}
						resolve(res.data)
					}
				},
				fail: function(err) {
					reject(err)
				}
	
			})
		})
}
