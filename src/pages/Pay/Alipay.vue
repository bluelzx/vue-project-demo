<template>
    <div class="alipay">
         <div class="fri-box" v-show="showDialog">
            <div class="fri-img"><img src="../../assets/image/notify.png" alt=""></div>
            <div class="fri-text">支付失败，请重试</div>
            <div class="fri-btn" ><a href="javascript:;" @click.self.stop="goConfirm()" class="btn-green">我知道了</a></div>
        </div>
        <div class="desk-bg" v-show="showDialog"></div>
    </div>
</template>
<script src="https://as.alipayobjects.com/g/component/antbridge/1.1.1/antbridge.min.js"></script>
<script>
    export default {
        data(){
            return {
                showDialog:false
            }
        },
        activated() {
            let _this = this;
            let token = localStorage.getItem("token");
            let orderId = _this.$route.params.orderId;
            // alert("支付:");
            let lsOrderId = localStorage.getItem("orderId:" + orderId);
            if(lsOrderId && lsOrderId == orderId){
                let token = localStorage.getItem("token");
                let tableId = localStorage.getItem("tableId");
                let storeId = localStorage.getItem("storeId");
                let tableName = localStorage.getItem("tableName");
                //清除购物车的数据
                sessionStorage.removeItem("selectFoods");
                sessionStorage.setItem("clearCat","1");
                _this.$router.push('/order/menuList/'+storeId+'/'+tableId+'/'+token+'/'+tableName);
                return;
            }
            //调用后台给的接口，返回tradeNO,在支付的时候调用
            _this.$http({
                method:'get',
                url:"/fastfood/luciaLacarraPay",
                headers: {'Authorization':'Basic '+ token },
                params:{
                    orderId:orderId
                }
            }).then((res) => {
                // alert("调起支付页面")
                if(res.data.code==200){
                    //唤起支付页面
                    _this.tradePay(res.data.model.tradeNO); 
                }else{
                    // _this.showDialog = true;
                   alert(res.data.message);
                }
            });
        },
        methods:{
            // 由于js的载入是异步的，所以可以通过该方法，当AlipayJSBridgeReady事件发生后，再执行callback方法
            ready(callback){
                if (window.AlipayJSBridge) {
                    callback && callback();
                } else {
                    document.addEventListener('AlipayJSBridgeReady', callback, false);
                }
            },
            tradePay(tradeNO){
                 let orderId = this.$route.params.orderId;
                 let token = localStorage.getItem("token");
                 let _this = this;
                 _this.ready(function(){
                    // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
                    AlipayJSBridge.call("tradePay", {
                        tradeNO: tradeNO
                    }, function (data) {
                        console.log("json: "+JSON.stringify(data));
                        if ("9000" == data.resultCode) {    //支付成功
                            _this.$http({//点击确定按钮，改变订单状态
                                method:'get',
                                url:'/fastfood/notifyRest',
                                headers: {'Authorization':'Basic '+ token },
                                params: {
                                    orderId:orderId
                                }
                            }).then(function(resData){
                                if(resData.data.code == 200){
                                    localStorage.setItem("orderId:" + orderId , orderId);
                                     _this.$router.push('/orderDetail/'+orderId+'/1');
                                }else{
                                    alert(resData.data.message);
                                }
                            });
                        }else if(data.resultCode == '4000' || data.resultCode == '6001'){    //4000支付失败,6001 //用户中途取消
                            _this.$router.push('/orderConfirm');
                        }else{
                            //关闭支付页面
                             AlipayJSBridge.call('closeWebview');
                        }
                    });
                });
            },
            goConfirm(){
                this.$router.push('/orderConfirm');
            }
        }
    }
</script>
<style lang="stylus">
    .alipay
        .fri-box
            position:fixed;
            top:50%
            left:50%;
            width:90%
            padding:20px 10px
            -webkit-transform: translate(-50%,-50%)
            -ms-transform: translate(-50%,-50%)  
            transform: translate(-50%,-50%)
            z-index:1000
            background-color:#fff
            border-radius:5px
            .fri-text
                margin:10px 0 20px
                text-align:center
            .fri-img 
                text-align:center
                img
                    width:30%
</style>