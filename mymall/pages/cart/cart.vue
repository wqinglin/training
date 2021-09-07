<template>
	<div>
		<view>{{msg}}</view>
		<button  @click="btn">改变</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				msg: 'hello'
			}
		},
		methods: {
			btn(){
				this.msg = 'wql'
				console.log(this.$el.innerText)	
			}
		}
	}
</script>

<style>
</style>
