import {request} from '@/common/request.js'

export default{
	data(){
		return {
			page: 0, //页码
			pageNum: 4, //每页加载数据量
			isLoading: false, //http请求刷新数据
			loadingType: 1, //0加载前 1加载中 2没有更多 (底下更多)
			loaded: false, //加载完毕（$nextTick, v-if 保证先有 res.data数据后 Dom的渲染）
		}
	},
	methods: {
		log(data){
			console.log(JSON.parse(JSON.stringify(data)))
		},
		/**
		 * navigatorTo跳转页面
		 * @param {String} url
		 * @param {Object} options
		 * @param {Boolean} options.login 是否检测登录  
		 */
		navTo(url, options={}){
			this.$util.throttle(()=>{
				if(!url){
					return;
				}
				if((~url.indexOf('login=1') || options.login) && !this.$store.getters.hasLogin){
					url = '/pages/auth/login';
				}
				uni.navigateTo({
					url
				})
			}, 300)
		},
		/** 重要
		 * $request
		 * @param {String} urlOP 路由
		 * @param {Boolean} data 请求参数
		 * @param {Boolean} ext 附加参数
		 * @param {Boolean} ext.cache 缓存参数
		 * @param {Boolean} ext.showLoading 是否显示loading状态，默认不显示
		 * @param {Boolean} ext.hideLoading 是否关闭loading状态，默认关闭
		 * @param {Boolean} ext.login 未登录拦截
		 * @param {Boolean} ext.setLoaded 加载完成是设置页面加载完毕
		 */
		$request(urlOp, data={}, ext={},method){
			/* if(ext.login && !this.$util.isLogin()){
				return;
			} */
			// uni.showLoading({
			//     title: '加载中'
			// });
			this.isLoading = true;
			return new Promise((resolve, reject)=> {
				request(urlOp, data, ext,method).then(result => {
					
					setTimeout(()=>{
						    //uni.hideLoading();
							this.isLoading = false;
							this.loaded = true;
					}, 500)
					resolve(result);
				}).catch((err) => {
					reject(err);
				})
			})
		},
		imageOnLoad(data, key){
			setTimeout(()=>{
				//this.$set(data, 'loaded', true); // $set(data,''isselected',true) 添加新的键值对
			}, 100)
		},
		showPopup(key){
			this.$util.throttle(()=>{
				this.$refs[key].open();
			}, 200)
		},
		hidePopup(key){
			this.$refs[key].close();
		},
		stopPrevent(){},
	},
}