<template>
	<div class="detail-out-box">
        <mt-header title="订单详情" class="detail-header">
            <mt-button v-show="$route.params.parentType==0" icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
            <mt-button v-show="$route.params.parentType==1" icon="back" slot="left" @click="goMenulist()">返回</mt-button>
        </mt-header>
		<div class="detail-box">
			<div class="order-status-dis plr12 clearfix">
				<div class="order-dis">
					<span class="icon-profile">
						<i class="iconfont icon-ziliao"></i>
						<span class="order-icon orderdetail-right"></span>
					</span>
					<p class="orderd-text">
						{{dataJson.status | orderStatus }}
					</p>
				</div>
			</div>
			<div class="detail-order-info">
				<div class="order-state">
					<p class="clearfix">
						<span class="head-box"><img :src="dataJson.headUrl"/></span>
						<span>{{dataJson.username}}</span>
						<span class="num">{{dataJson.tableName}}</span>
					</p>
					<div class="table-number clearfix">
						<span class="line-left"></span>
						<span class="text">就餐号</span>
						<span class="line-right"></span>
					</div>
					<div class="dish-number" v-if="dataJson.eatNumber!=''">{{dataJson.eatNumber}}</div>
					<div class="dish-number" v-if="dataJson.eatNumber==''">---</div>
                    <p class="alert-info">记住就餐号，请凭就餐号取餐</p>
                    <div class="order-state-bg"></div>
				</div>
				<div class="detail-order-list">
					<div class="title">订单菜品</div>
					<DishesItem :dishesData="dataJson.orderItemList"></DishesItem>
					<Addition :serviceList="dataJson.serviceList"></Addition>
					<div class="favorable-detail title" v-if="dataJson.activityName&&dataJson.activityName!=''">
						<div class="clearfix discount-box">
							<span class="pull-right">- ¥{{dataJson.paidDiscountMoney}}</span>
							<span class="color999"><i class="iconfont icon-hui"></i>{{dataJson.activityName}}</span>
						</div>
					</div>
					<div class="favorable-title title">
						<span class="pull-right">应付&nbsp;&nbsp;<span class="price">¥{{dataJson.paidMoney}}</span></span><span class="color999">合计 ¥{{resultMoney}}</span>
						<span v-if="dataJson.activityName&&dataJson.activityName!=''" class="already-discount color999">优惠¥{{dataJson.paidDiscountMoney}}</span>
					</div>
					<div v-if="dataJson.remark!=''">
						<div class="title">订单备注</div>
						<div class="remark-box plr12">
							<div class="remark-item"><span v-for="remark in remarkList"><i>•</i>{{remark}}</span></div>
							<div class="remark-input">{{remarkInput}}</div>
						</div>
					</div>
				</div>
			</div>	
			<div class="orderdetail-info-box plr12">
				<p class="order-title">订单信息</p>
				<div class="info-text">
					订单编号：<span class="pull-right">{{dataJson.orderNo}}</span>
				</div>
				<div class="info-text">
					下单时间：<span class="pull-right">{{dataJson.addtime}}</span>
				</div>
				<div class="info-text">
					支付方式：<span class="pull-right">{{payType(dataJson.payType)}}</span>
				</div>
				<div class="info-text" v-if="dataJson.invoiceType!=0">
					发票类型：<span class="pull-right">{{switchStatus(dataJson.invoiceType)}}</span>
				</div>
				<div class="info-text" v-if="dataJson.invoiceHeader!=''">
					发票抬头：<span class="pull-right wordwrap">{{dataJson.invoiceHeader}}</span>
				</div>
				<div class="info-text" v-if="dataJson.email!=''">
					发票邮箱：<span class="pull-right">{{dataJson.email}}</span>
				</div>
			</div>
            <div class="ad-box" v-if="advertise.imageUrl!=''">
                <a :href="advertise.adUrl"><img :src="advertise.imageUrl" :alt="advertise.name" /></a>
            </div>
			<img src="../../assets/image/wx.jpg" width="100%"/>
		</div>
		<div class="footer" v-show="dataJson.status==4">
			<div class="plr12">
				<a href="javascript:;" class="btn-green" @click="goComment(dataJson.orderId,dataJson.orderNo,dataJson.evaluateStatus)"><span v-show="dataJson.evaluateStatus==0">菜品评价</span><span v-show="dataJson.evaluateStatus==1">查看评价</span></a>
			</div>
		</div>
	</div>
</template>
<script>
	import Addition from "../../components/Addition.vue"
	import DishesItem from "../../components/DishesItem.vue"
	import '../../filter/status.js'
	export default {
		data(){
			return {
				dataJson:[],
                advertise:[],
				remarkList:"",
				remarkInput:"",
				resultMoney:0,
				parentType:1
			}
		},
        activated(){
			//加载详情信息
			let _this = this;
			this.parentType = this.$route.params.parentType;
			//setTimeout(function(){
				_this.loadInfo();
			//},500);
        },
		created(){
			//加载广告信息
			this.loadAdver();
		},
		components: {
			Addition,
			DishesItem
		},
		methods:{
			goMenulist(){
				let token = localStorage.getItem("token");
				let tableId = localStorage.getItem("tableId");
                let storeId = localStorage.getItem("storeId");
				let tableName = localStorage.getItem("tableName");
				//清除购物车的数据
				sessionStorage.removeItem("selectFoods");
				sessionStorage.setItem("clearCat","1");
                this.$router.push('/order/menuList/'+storeId+'/'+tableId+'/'+token+'/'+tableName);
			},
			goComment(orderId,orderNo){
				this.$router.push('/commentDishes/'+orderId+'/'+orderNo+"/"+this.dataJson.evaluateStatus)
			},
			loadAdver(){
				this.$http({
					method:'get',
					url:'http://portal.51eparty.com/api/ad?type=ORDER_DETAIL'
				}).then((res) => {
					if(res.data.data){
						this.advertise = res.data.data;
					}
				});
			},
			loadInfo(){
				let _this = this;
				let token = localStorage.getItem("token");
				let orderId = _this.$route.params.orderId;
				_this.$http({
					method:'get',
					url:'/fastfood/selectOrderDetail',
					headers: {'Authorization':'Basic '+ token },
					params: {
						orderId:orderId
					}
				}).then(function(res){
					if(res.data.code == 200){
						_this.dataJson = res.data.model;
						console.log(_this.dataJson.eatNumber);
						//存储nickname,headUrl,在菜品评价页面使用
						sessionStorage.setItem("nickName",_this.dataJson.username);
						sessionStorage.setItem("headUrl",_this.dataJson.headUrl);
						_this.resultMoney = _this.dataJson.totelprice;
						for(let i=0;i<_this.dataJson.serviceList.length;i++){
							_this.resultMoney += _this.dataJson.serviceList[i].money;
						}
						_this.resultMoney = (_this.resultMoney).toFixed(2);
						let _remark = res.data.model.remark
						if(_remark){
							if(_remark.split("!@#")[0]){
								_this.remarkList = _remark.split("!@#")[0].split(",");
							}
							_this.remarkInput = _remark.split("!@#")[1];
						}
					}
				});
			},
			switchStatus(status){
				//0.不需要发票 1.个人纸质 2.个人电子 3.公司纸质 4.公司电子
				var _text="";
				switch(status){
					case 0:
						_text = "不需要发票";
						break;
					case 1:
						_text = "个人纸质";
						break;
					case 2:
						_text = "个人电子";
						break;
					case 3:
						_text = "公司纸质";
						break;
					case 4:
						_text = "公司电子";
						break;
				}
				return _text;
			},
			payType(status){
				//1.微信支付 2线下支付 3.支付宝支付
				var _text="暂未支付";
				switch(status){
					case 1:
						_text = "微信支付";
						break;
					case 2:
						_text = "线下支付";
						break;
					case 3:
						_text = "支付宝支付";
						break;
				}
				return _text;
			}
		}

	}
</script>

<style lang="stylus" scoped>
	.plr12
		padding: 0 12px
	
	.color999
		color: #999
		
	bor-line()
		content: ""
		position: absolute
		top: 0
		left:0
		right: 0
		border-top:1px solid #ddd
		-webkit-transform-origin: 0 100%
		transform-origin:0 100%
		-webkit-transform:scaleY(0.5)
		transform:scaleY(0.5)
		
	.order-status-dis
		position: relative
		height:80px
		margin-bottom:10px
		background-image:linear-gradient(-225deg, #0bafa8, #138e89)
		.icon-profile
			position:absolute
			left:12px
			top:6px
		.icon-ziliao
			font-size:46px
			color:#11bbb4
	.detail-box
		background-color: #f1f1f1
		margin-top: 44px
		padding-bottom: 55px
		.alert-info
			color: #999
			text-align:center
			font-size:12px
			margin:10px 0
		.order-state-bg
			position:absolute
			left:0
			bottom:0
			height:20px
			width:100%
			background:url('../../assets/image/point.png') no-repeat center bottom
			background-size:100%
		.order-dis
			position:relative
			height:65px
			padding-left:82px
			background:#fff
			border-top-left-radius: 3px
			border-top-right-radius: 3px
			.orderdetail-right
				display:inline-block
				content: ''
				position: absolute
				left: 32px
				top: 30px
				width: 17px
				height: 17px
				background: url(../../assets/image/order-bg.png) no-repeat -9px -46px
				background-size: 45px 65px
		.orderd-text
			padding-top: 20px
			
	.detail-order-info
		position:relative
		background:#fff
		border-bottom-left-radius:5px
		border-bottom-right-radius:5px
		border-top:3px solid #cfcfcf
		margin:0 12px 12px
		box-shadow: 0px 0 2px rgba(160, 153, 153, 0.4)
		.order-state
			position:relative
			padding:13px 15px
			line-height:28px
			height:190px
			&:before,
			&:after
				content:""
				position:absolute
				right:-4px
				top:-4px
				width:5.5px
				height:6.5px
				background:url(../../assets/image/order-bg.png) no-repeat 0 -54.5px
				background-size:44px 65px
			&:after
				left:-4px
				background:url(../../assets/image/order-bg.png) no-repeat 0 -46.5px
				background-size:44px 65px
			span
				float:left
				margin-right:10px
			.head-box img
				display:block
				width:28px
				height:28px
				border-radius:50%
				overflow: hidden
			.num
				font-size:14px
				position: absolute
				right: 0
		.table-number
			text-align: center
			padding: 10px 0
			span
				margin-right: 0
				display: inline-block
				float: none
			.text
				padding: 0 10px
				color: #ff571d
				font-size: 14px
			.line-left
				background: #fff url(../../assets/image/line-left.png) no-repeat center center
			.line-right
				background: #fff url(../../assets/image/line-right.png) no-repeat center center
			.line-left,
			.line-right
				display: inline-block
				width: 40px
				height: 5px
				vertical-align: middle
				background-size: 37px 3px
		.dish-number
			text-align: center
			font-size: 34px
			color: #ff571d
       
	.detail-order-list 
		&:after
			bor-line()
		.title
			position:relative
			padding:12px
			line-height:16px
			font-size: 14px
			&:after
				bor-line()
				bottom:0
				top:inherit
	.favorable-detail
		padding: 12px
		font-size:14px
		.icon-hui
			color: #f97432
			font-size: 16px
			position: relative
			top: 1px
			padding-right: 5px
	.favorable-title
		position: relative
		padding: 12px
		font-size: 14px
		&:after
			bor-line()
		.price
			color:#f96132
			font-size: 15px
	.already-discount
		padding-left: 10px
	.footer:after
		bor-line()
		transform: scaleY(0.5)
	.orderdetail-info-box
		background-color: #fff
		font-size: 14px
		margin-bottom: 10px
		.order-title
			font-size: 15px
			padding:12px 0
			position:relative
			&:after
				position:absolute
				left:0
				right:0
				bottom:0
				content: ""
				border-bottom:1px solid #ddd
				transform:scaleY(0.5)
		.info-text
			position: relative
			padding:12px 0
			overflow:hidden
			&:after
				bor-line()
				bottom:0
				top:inherit
			.wordwrap
				word-break:break-word
	.ad-box
		margin-bottom: 8px
		img
			max-width: 100%
	.detail-out-box .detail-header
		background-image: linear-gradient(-225deg, #0bafa8, #138e89)
		border-bottom:none
		background-color:transparent
		color:#fff
	.remark-box
		font-size:14px
		color:#686868
		.remark-item
			padding: 12px 0
			span
				padding-right:8px
			i
				font-style:inherit
				padding-right:2px
		.remark-input
			padding-bottom:20px
			word-break: break-word
</style>