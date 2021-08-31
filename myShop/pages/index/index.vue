<template>
	<div>
	<!-- 导航头部 -->
	<!-- <uni-nav-bar color="#000" background-color="#fff" right-icon="scan">
		<block slot="left">
			<view class="city">
				<uni-icons type="location-filled" color="#333" size="22" />
			</view>
		</block>
		<view class="input-view">
			<uni-icons style="line-height: 30px;" type="search" size="22" color="#666666" />
			<input confirm-type="search" class="nav-bar-input" type="text" placeholder="1元好课">
		</view>
	</uni-nav-bar> -->
	<!-- 顶部栏 -->
	<!-- #ifndef MP-WEIXIN -->
	<page-header :showFillView="false"></page-header>
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
	</div>
</template>

<script>
	import pageHeader from '../../components/page-header.vue'
	export default {
		components: {
			pageHeader
		},
		data() {
			return {
				swipers: [],
			}
		},
		onLoad() {
            this.getSwiper();
		},
		methods: {
			async getSwiper() {
				await this.common.get('/api/getswiper', []).then((res) => {
					console.log(res.data)
					this.swipers = res.data
				})

			},
		}
	}
</script>

<style>
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
</style>
