<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 获得设备的信息
			uni.getSystemInfo({
				success: e=> {
					this.initSize(e);
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			/**
			 * 存储设备信息 参考colorUI
			 * @param {Object} 
			 */
			initSize(e){
				const systemInfo = e;
				let navigationBarHeight;
				let custom = {};
				// #ifndef MP
				custom = {height: 36,width: 88};
				navigationBarHeight = 44;
				// #endif
				// #ifdef MP-WEIXIN
				custom = wx.getMenuButtonBoundingClientRect();
				navigationBarHeight = custom.bottom + custom.top - e.statusBarHeight * 2;
				// #endif	
				systemInfo.custom = custom;
				systemInfo.navigationBarHeight = navigationBarHeight;
				// 设置全局变量
				Vue.prototype.systemInfo = systemInfo;
			}
		}
	}
</script>

<style  lang="scss">
	/*每个页面公共css */
	/*每个页面公共css */
	@import url("./static/css/common.css");
	@import url("./static/css/icon.css");
</style>
