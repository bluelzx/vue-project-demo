<template>
	<div class="comment-dish-box">
		<mt-header title="菜品评价">
            <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        </mt-header>
		<div class="comment-dish">
			<div class="dish-text color999">{{text}}</div>
			<ul class="comment-dish-list comment-list clearfix" v-show="showDetial==0">
				<li :class="{'dish-item':true,'checkli':item.checked}" v-for="item in dataList" >
					<div class="item-inner" @click="checked(item)">
						<div class="dish-img">
							<img v-if="item.dishesUrl" style="max-width:100%;" :src="item.dishesUrl">
							<img v-else src="../../assets/image/nodish.png">
						</div>
						<div class="dish-title"><span class="pull-right">¥{{item.price}}</span>{{item.dishesName}}<span v-show="item.propertyName!=''">（{{item.propertyName}}）</span></div>
						<div class="bg-shadow" v-show="item.checked"><i class="iconfont icon-checked"></i></div>
					</div>
				</li>
			</ul>
			<ul class="comment-dish-list details-list" v-show="showDetial==1">
				<li class="comment-list-item" v-for="item in commentList">
					<div class="list-inner-item">
						<div class="dish-img">
							<img v-if="item.dishesUrl" :src="item.dishesUrl">
							<img v-else src="../../assets/image/nodish.png">
						</div>
						<div class="item-text">
							<h3><span class="pull-right">¥{{item.price}}</span>{{item.dishesName}}<span v-show="showProName(item.propertyName)">（{{item.propertyName}}）</span></h3>
							<p>月销量<b>{{item.monthNumber}}</b>单</p>
							<p>喜欢TA<b>{{item.likeNumber}}</b>人</p>
						</div>
					</div>
					<div class="friend-box">
						<p>同样喜欢它的百味云网友：</p>
						<ul class="friend-list clearfix">
							<li v-for="subitem in item.userList"><img :src="subitem.headImgUrl"></li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<div class="footer" v-show="showDetial==0">
			<div class="plr12">
				<a href="javascript:void(0);" class="btn-green" @click.stop.prevent="comment">提交订单</a>	
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import { Toast } from 'mint-ui';
	Vue.component(Toast.name, Toast);
	export default {
		data() {
			return {
				dataList:[],
				commentList:[],
				showDetial:0,
				token:'',
				text:"选出您最喜欢的菜品："
			}	
		},
		activated(){
			// 获取待评价的菜品	'821'
			sessionStorage.removeItem("commentType");
			this.token = localStorage.getItem("token");
			let orderId = this.$route.params.orderId;
			let _type = sessionStorage.getItem("commentType");
			this.showDetial = this.$route.params.evaluateStatus;
			if(_type == ""||_type == null){
				_type = this.showDetial;
			}
			
			if(_type == 1||_type == '1'){//已评价
				this.getCommentDetail(orderId);
				this.text = "您最喜欢的菜品是：";
			}else{	//未评价
				this.getUnCommentDish(orderId);
				this.text = "选出您最喜欢的菜品：";
			}
		},
		methods :{
			checked(item) {
				if(typeof item.checked=='undefined'){
					this.$set(item,"checked",true);
				}else{
					item.checked = !item.checked;
				}
			},
			showProName(propertyName){
				if(propertyName == '""') return false;
				return true;
			},
			getUnCommentDish(orderId){
				let _this = this;
				_this.$http({
					method:'get',
					url:'/fastfood/findDishesInfo',
					headers: {'Authorization':'Basic '+ _this.token },
					params: {
						orderId:orderId
					}
				}).then((res) => {
					console.log(res.data);
					if(res.data.code==200){
						_this.dataList = res.data.model;
					}else{
						alert(res.data.message);
					}
				});
			},
			getCommentDetail(orderId){
				let _this = this;
				_this.$http({
					method:'get',
					url:'/fastfood/findOrderEvaluateInfo',
					headers: {'Authorization':'Basic '+ _this.token},
					params: {
						orderId:orderId
					}
				}).then((res) => {
					if(res.data.code==200){
						_this.commentList = res.data.model;
					}else{
						Toast(res.data.message);
					}
				});
			},
			comment() {
				let _this = this;
				let _dishesId = "";	
				let nickName = sessionStorage.getItem("nickName");
				let headUrl = sessionStorage.getItem("headUrl");
				let storeId = localStorage.getItem("storeId");
				let orderId = this.$route.params.orderId;
				let orderNo = this.$route.params.orderNo;
				
				let checkedObj =  document.querySelectorAll(".checkli");
				let _checkedLength = checkedObj.length;
				if(_checkedLength<=0){
					Toast('请选中您要评价的菜品');
					return;
				}
				//遍历选中的菜品
				_this.dataList.forEach(function(item,index){
					if(item.checked){
						let _propertyName="";
						if(item.propertyName){
							_propertyName = item.propertyName;
						}else{
							_propertyName = '""';
						}
						if(index < _checkedLength ){
							_dishesId += item.dishesId + ":" + _propertyName + ",";
						}else{
							_dishesId += item.dishesId + ":" + _propertyName;
						}
					}
				});
				let postData = {
					orderId:orderId,
					orderNo:orderNo,
					storeId:storeId,
					dishesId:_dishesId,
					nickname:nickName,
					headImgUrl:headUrl
				};
				console.log(postData)
				// postData = JSON.stringify(postData);
				_this.$http({
					method:'post',
					url:'/fastfood/orderInfoEvaluate',
					headers : {
						'Authorization':'Basic '+_this.token,
						// "content-type" : "application/json"
					},
					data:postData
				}).then((res) => {
					if(res.data.code==200){
						_this.getCommentDetail(orderId);
						sessionStorage.setItem("commentType","1");
						_this.text = "您最喜欢的菜品是：";
						_this.showDetial = 1;
					}else{
						Toast(res.data.message);
					}
				});
			}
		}
	}
</script>
<style lang="stylus">
	.comment-dish-box
		margin-bottom:55px
	.comment-dish
		margin-top:45px
		.dish-text
			padding:12px
			font-size: 15px
			background-color:#f1f1f1
		.dish-item
			float: left
			width: 50%
			padding-right:7px
			padding-bottom:10px
			box-sizing: border-box
			overflow: hidden
	.comment-dish-list.comment-list
		padding:0 5px 0 12px
		background-color:#f1f1f1
	.dish-item 
		.item-inner
			position:relative
			background-color:#fff
			box-shadow:1px 1px 9px rgba(0,0,0,.2)
			border-radius: 4px
			overflow: hidden
		.dish-img
			position: relative
			height:170px
			overflow:hidden
		.bg-shadow
			position: absolute
			left:0;top:0;right:0;bottom:0
			background-color:rgba(0,0,0,.5)
			border-radius: 4px
			.icon-checked
				position: absolute
				left: 50%
				top:50%
				z-index: 10
				font-size: 50px
				transform:translate(-50%,-50%)
				-webkit-transform:translate(-50%,-50%)
				color:#fff
		.dish-title
			padding: 10px 8px
			font-size: 13px
			position: relative
			height:38px
			white-space:nowrap
			overflow:hidden
			text-overflow:ellipsis
		.pull-right
			color:#fd661c
			position: absolute
			top: 10px
			right: 8px
			font-size:14px
			background-color:#fff
	.list-inner-item
		position:relative
		padding: 13px 0 13px 82px
		font-size: 12px
		&:after
			content:""
			position:absolute
			left:0
			bottom:0
			right:0
			border-bottom:1px solid #d6d6d6
			transform:scaleY(0.5)
	.comment-list-item 
		padding: 0 12px 8px
		border-bottom:10px solid #f1f1f1
		h3
			font-size: 14px
			margin-bottom: 10px
			.pull-right
				color:#e46926
		p
			color: #999
			margin-top: 4px
			b
				color:#666
				padding: 0 5px
		.dish-img
			width: 65px
			height: 65px
			overflow: hidden
			position:absolute
			top:10px
			left:0
			img
				max-width:100%
	.friend-list
		img
			width: 30px
			height: 30px
			display: inline-block
			border-radius: 50%
			overflow: hidden
	.friend-box 
		p
			font-size: 12px
			color:#999
			margin-bottom: 5px
			margin-top: 5px
		li
			float: left
			margin-right: 10px
	.plr12
		padding:0 12px
</style>