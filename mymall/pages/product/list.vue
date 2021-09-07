<template>
	<view class="app" :class="{overhidden: list.length === 0}">
		<!-- 头部 -->
		<page-header :keyword="keyword" :listType="listType" :sourcePage="sourcePage" @delKeyword="delKeyword"
			@changeListType="changeListType"></page-header>
		<!-- 顶部筛选 分类栏 -->
		<view class="top" :style="{top: navigationBarHeight + statusBarHeight + 'px'}">
			<!-- 排序 -->
			<view class="sort-bar row">
				<view class="item row center" :class="{active: item.current, last: index === sortList.length-1}"
					v-for="(item,index) in sortList" :key="index" @click="changeSort(item)">
					<text>{{ item.name }}</text>
					<view v-if="item.isPrice" class="icon-wrap">
						<text class="mix-icon icon-down" :class="{active: item.type === 3}"></text>
						<text class="mix-icon icon-arrow-top" :class="{active: item.type === 4}"></text>
					</view>
				</view>
				<!-- #ifdef MP -->
				<view class="btn center">
					<text class="mix-icon"
						:class="listType === 'column' ? 'icon-hengxiangliebiao' : 'icon-shuxiangliebiao'"
						@click="changeListType"></text>
				</view>
				<!-- #endif -->
			</view>

		</view>
		<!-- 产品列表 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :top="headerHeight" @down="downCallback" :up="upOption"
			@up="loadList">
			<product-list ref="productList" :list="list" :listType="listType"></product-list>
		</mescroll-body>

		<mix-loading v-if="isLoading"></mix-loading>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import pageHeader from '@/components/list-page-header'
	import productList from '@/components/product-list'
	import mixLoading from '@/components/mix-loading/mix-loading.vue'
	export default {
		components: {
			pageHeader,
			productList,
			mixLoading
		},
		mixins: [MescrollMixin],
		data() {
			return {
				sourcePage: '', //来源页 主要用来判断是否来自搜索页
				listType: 'column', //列表类型 column竖向列表 row 横向列表
				sortList: [{
						name: '综合排序',
						type: 1,
						current: true
					},
					{
						name: '销量',
						type: 2,
						current: false
					},
					{
						name: '价格',
						type: 3,
						isPrice: true,
						current: false
					},

				],
				isHot: 1, //热门推荐
				keyword: '',
				cateList: [], //分类列表
				curCateItem: {}, //当前分类
				list: [], //商品列表
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 4
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
				},
			}
		},
		computed: {
			statusBarHeight() {
				return this.systemInfo.statusBarHeight
			},
			navigationBarHeight() {
				return this.systemInfo.navigationBarHeight;
			},
			headerHeight() {
				return 750 / uni.upx2px(750) * (this.navigationBarHeight + this.statusBarHeight) + 96;
			},
		},
		onLoad(options) {
			this.isLoading = true;
			this.sourcePage = options.sourcePage || '';
			this.keyword = options.keyword || ''; //搜索关键字
			this.prePage = options.prePage; //来源页 主要用于区分是否来自搜索页面
			console.log('==================================')
			console.log(this.sourcePage)
		},
		methods: {
			//加载产品列表
			async loadList(e) {
				// 移除无任何数据的空布局
				this.mescroll.removeEmpty();
				const {
					sortList,
					curCateItem,
					keyword
				} = this;
				const data = {
					sort_type: sortList.filter(item => item.current)[0].type,
					categoryid: curCateItem._id || '',
					first_cate_id: curCateItem.parent_id || '',
					keyword,
					currentPage: e.num
				}
				this.$refs.productList.loadType = e.num === 1 ? 'refresh' : 'add';
				const res = await this.$request('search', data);
				const curList = res.data;
				if (e.num === 1) {
					//第一页清空数据重载
					this.list = [];
					this.loaded && curList.forEach(item => {
						item.loaded = true;
					})
					if (curList.length > 0) {
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 200
						})
					}
				}
				this.list = this.list.concat(curList); //追加新数据
				// 隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用
				this.mescroll.endSuccess(curList.length); //结束加载状态
				console.log(e.num);
				console.log(JSON.parse(JSON.stringify(res.data)));
			},
			//加载分类列表
			async loadCateList() {
				const res = await this.$request('product', 'getSecondCategory', {
					id: this.curCateItem.parent_id
				}, {
					changeLoaded: false
				})
				this.cateList = res.data || [];
				this.$nextTick(() => {
					this.calcCateRect();
				})
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
				setTimeout(() => {
					this.refreshList();
				}, 10)
			},
			//刷新列表, 刷新接口
			refreshList() {
				// 不显示上拉和下拉的进度 (常用于静默更新列表数据)
				this.mescroll.resetUpScroll(false)
				this.isLoading = true;
			},
			//排序
			changeSort(item) {
				if (item.current) {
					if (item.isPrice) {
						item.type = item.type === 3 ? 4 : 3;
					} else {
						return;
					}
				} else {
					this.sortList.forEach(v => v.current = false);
					item.current = true;
					if (item.type === 3 || item.type === 4) {
						item.type = 3;
					}
				}
				this.refreshList();
			},
			//删除搜索关键字
			delKeyword() {
				this.keyword = '';
				this.refreshList();
			},
			//修改列表显示方式
			changeListType() {
				this.listType = this.listType === 'column' ? 'row' : 'column';
			}
		}
	}
</script>

<style>
	page {
		background-color: #f8f8f8;
	}
</style>
<style scoped lang="scss">
	.app {

		/* #ifndef MP */
		&.overhidden {
			height: 100vh;
			overflow: hidden;
		}

		/* #endif */
	}

	/deep/ .mix-empty .default {
		padding-top: 38vh;
		/* #ifdef H5 */
		padding-top: 34vh;
		/* #endif */
	}

	.top {
		position: fixed;
		left: 0;
		width: 100%;
		z-index: 95;
		background-color: #fff;
	}

	.sort-bar {
		justify-content: space-around;
		height: 76rpx;
		padding: 4rpx 0 4rpx 4rpx;
		/* #ifdef MP */
		padding-left: 10rpx;
		/* #endif */
		background-color: #fff;
		position: relative;
		z-index: 1;

		.item {
			flex: 1;
			height: 100%;
			font-size: 28rpx;
			color: #333;
			position: relative;
			overflow: hidden;

			&.active {
				color: $base-color;
				font-weight: 700;

				&:after {
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-28rpx);
					content: '';
					width: 56rpx;
					height: 4rpx;
					background-color: $base-color;
					border-radius: 10px;
				}

				.mix-icon.active {
					color: $base-color;
				}
			}

			/* #ifdef MP */
			&.last:before {
				content: '';
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 2rpx;
				height: 40rpx;
				box-shadow: 0 0 16rpx rgba(0, 0, 0, .6);
			}

			/* #endif */
		}

		.icon-wrap {
			display: flex;
			flex-direction: column;
			padding-left: 8rpx;
		}

		.mix-icon {
			font-size: 14rpx;
			color: #bbb;
		}

		.btn {
			height: 68rpx;
			padding-left: 16rpx;
			padding-right: 20rpx;

			.icon-hengxiangliebiao,
			.icon-shuxiangliebiao {
				font-size: 40rpx;
				color: #333;
			}
		}
	}

	.cate-bar:after {
		border-color: #f5f5f5;
	}

	.cate-wrap {
		flex-wrap: nowrap;
		height: 96rpx;
		padding-bottom: 4rpx;

		.fill-view {
			flex-shrink: 0;
			width: 20rpx;
			height: 20rpx;

			&:last-child {
				width: 10rpx;
			}
		}

		.item {
			flex-shrink: 0;
			height: 58rpx;
			padding: 0 28rpx;
			margin-right: 20rpx;
			font-size: 22rpx;
			color: #333;
			text-align: center;
			line-height: 58rpx;
			background-color: #f5f5f5;
			border-radius: 100px;
		}

		.active {
			color: $base-color;
			background-color: #fff8f4;
			font-weight: 700;
		}
	}
</style>
