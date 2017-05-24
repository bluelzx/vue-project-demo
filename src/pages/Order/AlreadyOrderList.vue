<template>
    <div>
        <mt-header title="已点订单">
            <mt-button icon="back" slot="left" @click="$router.go(-1)">返回</mt-button>
        </mt-header>
        <div class="order-title-info text-center">
            <h4>{{storeName}}</h4>
            <p class="color999">{{tableName}}</p>
        </div>
         <ul class="order-list">
            <div class="no-already-order text-center" v-show="orderlist.length==0">
                <p>您目前没有已点订单</p>
                <a href="javascript:;" class="btn-green" @click="orderDishes()">立即点餐</a>
            </div>
            <li v-for="item in orderlist" @click="goDetial(item.orderId)">
                 <OrderList :item="item"></OrderList>
            </li>
        </ul>
    </div>
</template>
<script>
    import OrderList from '../../components/OrderList.vue'
    export default {
         data() {
            return {
                storeName:'',
                tableName:'',
                token:'',
                orderlist:[]
            }
        },
        activated(){
            this.token = localStorage.getItem("token");
            this.tableName = localStorage.getItem("tableName");
            this.storeName = localStorage.getItem("storeName");
            this.getOrderList(this.token);
        },
        methods:{
            orderDishes(){
                let tableId = localStorage.getItem("tableId");
                let storeId = localStorage.getItem("storeId");
                this.$router.push('/order/menuList/'+storeId+'/'+tableId+'/'+this.token+'/'+this.tableName);
            },
            goDetial(orderId){
                this.$router.push('/orderDetail/'+orderId+'/0');
            },
            getOrderList(token){
                let _this = this;
                _this.$http({
                    type:'get',
                    url:'/fastfood/findKCSameDayOrderListInfo',
                    headers: {'Authorization':'Basic '+ token }
                }).then((res) => {
                    if(res.data.code==200){
                        _this.orderlist = res.data.model;
                    }
                });
            }
        },
        components:{
            OrderList
        }
    }
</script>
<style lang="stylus">
    .text-center
        text-align:center
    .order-title-info
        padding:20px 0
        margin-top:45px
        h4
            margin-bottom:10px
    .no-already-order
        padding: 0 12px
        font-size:14px
        p
            padding:50px 0 30px
            color:#999

</style>