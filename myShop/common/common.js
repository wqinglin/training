const key = 'secret';
const domain = 'http://localhost:3000'; // https://www.xiaoxiao.com
const domainUpload = 'http://localhost:3000/upload/';
export default {
	// 数据传输: get  post  put(修改)  delete(删除)
	get: function(url, params = []) {
		return new Promise(function(resolve, reject) {
			var data = {};
			for (var i in params) {
				data[i] = params[i]
			}
			uni.request({ // 请求接口
				url: domain + url,
				data: data,
				success: (res) => {
					if (res.data.code == 1) {
						resolve(res.data)
					}
				},
				fail: function(err) {
					reject(err)
				}
			})
		})
	},
	getConfig: function(configName) {
		if (configName == 'domain') {
			return domain
		} else if (configName == 'domainUpload') {
			return domainUpload
		}
	}
}

/*
  CORS policy: No 'Access-Control-Allow-Origin'  不允许跨越(不符合同源策略)
  后台:  http://localhost:3000
  前端H5 ： http://localhost:8080
  同源策略： 协议（http,https） 域名，端口 都必须相同。
  
  解决方法:  (1)服务器 Cors 配置（重要），（2）jsonp （3）框架中配置 服务代理
  
  koa2 ：app.js中 
     安装 : npm install koa-cors --save 模块
	 
	 // 1. 导入模块
	 const cors = require("koa-cors");
	 // 2. 
	 app.use(async (ctx, next) => {
	   ctx.set("Access-Control-Allow-Origin"); // 跨域访问
	   ctx.set("Access-control-Allow-Methods", "*");
	   ctx.set("Access-Control-Max-Age", 1728000);
	   ctx.set(
	     "Access-control-Allow-Headers",
	     "X-Requested-With,content-type,Authorization"
	   ); // 设置接收携带Authorization的请求
	   await next();
	 }); 
	 app.use(cors());

*/
