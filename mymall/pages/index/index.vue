<template>
	<view>
		<!-- 顶部栏 -->
		<!-- #ifndef MP-WEIXIN -->
		<page-header :showFillView="false"></page-header>
		<!-- @up="loadHotList" 上拉分页     @down="downCallback"   下拉刷新   :top="headerHeight"  计算出头部应该的高度-->
		<mescroll-body ref="mescrollRef" :top="headerHeight" @down="downCallback" :up="upOption" @up="loadHotList">
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<page-header :showFillView="true"></page-header>
			<!-- #endif -->
			<!-- 轮播图 -->
			<view class="swiper">
				<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
					<swiper-item v-for="swiper in swipers" :key="swiper.id">
						<navigator :url="swiper.url">
							<view class="swiper-item">
								<image :src="swiper.imgurl" mode=""></image>
							</view>
						</navigator>
					</swiper-item>
				</swiper>
			</view>
			<!-- 二级导航 -->
			<!-- 分类 -->
			<view class="cate-section">
				<view class="item" v-for="cate in cates" :key="cate.id">
					<image class="icon" :src="cate.imgurl"></image>
					<text>{{ cate.name }}</text>
				</view>
			</view>
			<!-- 热门推荐 -->
			<view class="hot-wrap" :class="{show:loaded}">
				<view class="floor-header row">
					<image class="icon" src="/static/icon/hot.png"></image>
					<view class="column fill">
						<text class="tit">热门推荐</text>
						<text>Popular Recommendation</text>
					</view>
					<text class="mix-icon icon-you"></text>
				</view>
				<product-list ref="productList" :list="productList"></product-list>
			</view>
			<!-- #ifndef MP -->
		</mescroll-body>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<load-more :status="loadingType"></load-more>
		<!-- #endif -->
	</view>
</template>

<script>
	import loadMore from '../../components/load-more/load-more.vue'
	import pageHeader from '../../components/page-header.vue'
	import productList from '../../components/product-list.vue'
	import homeMixin from './mixin/home'
	export default {
		mixins: [homeMixin], // 局部混入
		components: {
			pageHeader,
			productList,
			loadMore
		},
		data() {
			return {
				swipers: [],
				cates: [],
				productList: []

			}
		},
		onLoad() {
			this.getSwiper();
			// 二级导航
			this.getCates();
		},
		methods: {
			async getSwiper() {
				/* await this.common.get('/api/getswiper', []).then((res) => {
					console.log(res.data)
					this.swipers = res.data
				}) */
				const res = await this.$request('getswiper', {}, {
					cache: 10 * 60
				});
				this.swipers = res.data

			},
			async getCates() {
				const res = await this.$request('cates', {}, {
					cache: 60 * 60,
				});
				this.cates = res.data;
			},
			/* async getgoodsList(page) {
				await this.common.get('/api/recommend?currentPage='+page, []).then((res) => {
					//this.mescroll.endByPage(res.data.length, res.totalPage);
					//if (page.num == 1) this.productList = []; //如果是第一页需手动制空列表
					this.productList = this.productList.concat(res.data); //追加新数据
					console.log(this.productList);
			
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				}) 
				//const res = await this.$request('recommend', {currentPage:1});
				//this.productList = this.productList.concat(res.data); //追加新数据
			},*/
		}
	}
</script>

<style scoped lang="scss">
	.swiper {
		padding: 10rpx;
	}

	.swiper-item image {
		width: 100%;
		/* #ifdef APP-PLUS || MP-WEIXIN */
		height: 260rpx;
		/* #endif */

		/* #ifdef H5 */
		height: 300rpx;
		/* #endif */

		/* border-radius: 20rpx; */
	}

	.city {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 4px;
	}

	.input-view {
		display: flex;
		flex-direction: row;
		flex: 1;
		background-color: #f0f0f0;
		height: 30px;
		border-radius: 15px;
		padding: 0 15px;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: 30px;
	}

	.nav-bar-input {
		height: 30px;
		line-height: 30px;
		width: 370rpx;
		padding: 0 5px;
		font-size: 14px;
		background-color: #f0f0f0;
	}

	/* 分类 */
	.cate-section {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 10rpx 16rpx;
		background: #fff;

		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 20%;
			padding: 20rpx 0;
			font-size: 24rpx;
			color: #333;
		}

		.icon {
			width: 150rpx;
			height: 150rpx;
			margin-bottom: 14rpx;
			border-radius: 50%;
		}
	}

	.floor-header {
		padding: 6rpx 30rpx 8rpx 24rpx;
		font-size: 24rpx;
		color: #999;
		background-color: #fff;

		.icon {
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			margin-bottom: 10rpx;
			font-size: 32rpx;
			color: #333;
			font-weight: 700;
		}

		.icon-you {
			font-size: 28rpx;
			color: #999;
		}
	}

	.hot-wrap {
		padding-top: 20rpx;
		background: linear-gradient(to bottom, #fff 10rpx, #f7f7f7);
		opacity: 0;
		transition: opacity .2s;

		&.show {
			opacity: 1;
		}

		.floor-header {
			padding-bottom: 30rpx;
		}

		/deep/ .list-item {
			box-shadow: 4rpx 0 10rpx rgba(0, 0, 0, .06);
		}
	}
</style>
