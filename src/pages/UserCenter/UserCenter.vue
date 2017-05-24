<template>
    <div>
        <mt-header title="个人中心">
            <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        </mt-header>
        <div ref="scrollPage">
            <div class="info-box">
                <img slot="icon" class="avatar" :src="userInfo.headerUrl" width="75" height="75">
                <p class="user-name">{{userInfo.nickname}}<i v-show="userInfo.sex==2" class="iconfont icon-nv"></i><i v-show="userInfo.sex==1" class="iconfont icon-nan"></i></p>
                <p class="phone">{{ phoneFilter(userInfo.phone) }}</p>
            </div>
            <div class="tab-name">
                <span v-bind:class="{active:isActive}" @click="isActive = !isActive">我的订单</span>
                <span v-bind:class="{active:!isActive}" @click="isActive = !isActive">服务记录</span>
            </div>
            <ul class="order-list" v-show="isActive">
                <div class='noorder' v-show="orderlist.length==0"><p>暂无订单信息</p></div>
                <li v-for="item in orderlist" @click="goDetial(item.orderId)">
                    <OrderList :item="item"></OrderList>
                </li>
            </ul>
            <ul v-show="!isActive">
                <div class='norecord'><p>暂无服务记录</p></div>
            </ul>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import BScroll from 'better-scroll'
    import OrderList from '../../components/OrderList.vue'
    export default {
        data() {
            return {
                isActive:true,
                userInfo:{},
                orderlist:[]
            }
        },
        activated() {
            let token = localStorage.getItem("token");
             //调用个人信息
            this.loadUserInfo(token);
             //加载订单列表
            this.loadOrderList(token);
        },
        methods:{
            loadOrderList(token){
                let _this = this;
                _this.$http({
                    method:'get',
                    url:'/fastfood/findOrderListInfo',
                    headers: {'Authorization':'Basic '+ token }
                }).then((res) => {
                    if(res.data.code==200){
                        if(res.data.model){
                            this.orderlist = res.data.model;
                        }
                    }else{
                        alert(res.data.message);
                    }
                });
            },
            loadUserInfo(token){
                let _this = this;
                _this.$http({
                    method:'get',
                    url:'/fastfood/getUserInfo',
                    headers: {'Authorization':'Basic '+ token }
                }).then((res) => {
                    if(res.data.code==200){
                        _this.userInfo = res.data;
                    }else{
                        alert(res.data.message);
                    }
                });
            },
            phoneFilter(value) {    // 手机号码中间四位值替换
                if(!value) return "暂无手机号";
                let _subphone = value.substring(3,7);
                return value.replace(_subphone,'****');
            },
            goDetial(orderId){
                this.$router.push('/orderDetail/'+orderId+'/0');
            }
        },
        components:{
            OrderList
        }
    }
</script>

<style lang="stylus"> 
    plr = 12px;
    fz = 12px;
    bor-line()
        content: "";
        left:0;
        right:0;
        bottom: 0;
        display: block;
        position: absolute;
        border-bottom: 1px solid #ddd;
        -webkit-transform-origin: 0 100%;
        transform-origin:0 100%;
        -webkit-transform:scaleY(0.5);
        transform:scaleY(0.5);

    w-h(size)
        width:size;
        height:size;
    $po-rela
        position:relative;
    p
        padding:0;margin:0;
    .pindan
        color:#ef9500;
        font-size:18px;
    .icon-nv
        padding-left:5px;
        color:#ff9292;
    .icon-nan
        padding-left:5px;
        color:#92b8ff;
    .info-box
        @extend $po-rela;
        height:100px;
        padding: 25px 0 0 110px;
        margin-top:45px;
        .avatar
            position: absolute;
            top: plr;
            left: plr;
            display: block;
            w-h(75px);
            border-radius: 50%;
            border: 2px solid #fff;
        .user-name
            font-size: 16px;
        .phone
            margin-top:8px;
            color:#999;
            font-size:fz + 2px;
        &:after
            bor-line()
    .tab-name
        padding:plr;
        @extend $po-rela;
        text-align:center;
        span
            @extend $po-rela;
            display:inline-block;
            width:45%;
            &:first-child:after
                content: " ";
                position: absolute;
                right: 0;
                top: 0;
                width: 1px;
                height: 100%;
                border-right: 1px solid #cccccc;
                color: #cccccc;
                -webkit-transform-origin: 100% 0;
                transform-origin: 100% 0;
                -webkit-transform: scaleX(0.5);
                transform: scaleX(0.5);
        .active:before
            content: "";
            left:30%;
            width:40%
            bottom: -11px;
            display: block;
            position: absolute;
            border-bottom: 1px solid #333;
        &:after
            bor-line()
   
</style>

