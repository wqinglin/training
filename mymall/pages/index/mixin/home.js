// #ifdef MP
/* 小程序端 */
export default{
	onLoad() {
		this.loadHotList('refresh');
	},
	onPullDownRefresh() {
		this.loadHotList('refresh');
	},
	onReachBottom(){
		this.loadHotList();
	},
	methods: {
		//加载热门推荐列表
		async loadHotList(type='add'){
			//增加数据
			if(type === 'add'){
				//没有更多
				if(this.loadingType === 2) return;
				this.page = this.page + 1;
				this.$refs.productList.loadType = 'add';
			}else{
				//刷新数据
				this.page = 1;
				this.productList = [];
				if(this.$refs.productList){
					this.$refs.productList.loadType = 'refresh';
				}
			}
			//加载中
			this.loadingType = 1;
			const res = await this.$request('recommend', {
				currentPage: this.page});
			const curList = res.data;
			this.productList = this.productList.concat(curList); //追加新数据
			if(type === 'refresh'){
				uni.stopPullDownRefresh();//结束加载状态
			}
			setTimeout(()=>{
				this.loadingType = curList.length < 10 ? 2 : 0;
			}, 300)
		},
	},
}
// #endif


// #ifndef MP
/* 非小程序端 */
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default{
	mixins: [MescrollMixin], 
	data() {
		return {
			upOption:{
				auto: false, // 是否自动加载
				page: {
				 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size:3 //每页数据三条
				},
				noMoreSize:4 ,
			},
		}
	},
	computed: {
		headerHeight(){
			return 750 / uni.upx2px(750) * (this.systemInfo.navigationBarHeight + this.systemInfo.statusBarHeight);
		}
	},
	methods: {
		//加载热门推荐列表
		async loadHotList(mescroll){
			console.log(mescroll)
			if(mescroll.num === 1){
				//第一页清空数据重载
				this.productList = [];
				//  重要  $ref  可以访问子组件中的方法和属性
				//  ref="productList"  子组件的DOM ,this.$refs.productList   
				if(this.$refs.productList){
					this.$refs.productList.loadType = 'refresh';
				}
			}else{
				this.$refs.productList.loadType = 'add';
			}
			const res = await this.$request('recommend', {
				currentPage: mescroll.num});
			
			const curList = res.data;
			this.productList = this.productList.concat(curList); //追加新数据
			this.mescroll.endSuccess(curList.length); //结束加载状态
			console.log(e.num);
			console.log(JSON.parse(JSON.stringify(res.data)));
		},
		
		downCallback(mescroll){
			this.mescroll = mescroll;
			setTimeout(()=>{
				this.refreshList();
			}, 10)
		},
		//刷新列表
		refreshList(){
			this.mescroll.resetUpScroll(false)
			this.isLoading = true;
		}
	},
}
// #endif
