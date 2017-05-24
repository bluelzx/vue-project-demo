<template>
    <div :class="{'isNotice': !notice.name}">
        <div class="order-head">
            <div class="head clearfix">
                <button type="button" @click="routeUserCenter()" class="pull-left"><i class="iconfont icon-icon"></i></button>
                <button type="button" @click="routeOrder()" class="pull-right"><i class="iconfont icon-order"></i>已点订单</button>
            </div>
            <div class="notice" v-if="notice.name">
              <i class="iconfont icon-tongzhi"></i>
              {{notice.name}}
            </div>
            <div class="tab-ul">
              <ul>
                <li>
                <router-link to="/order/menuList">菜单列表</router-link>
                </li>
                <li>
                <router-link to="/order/storeDetail">餐厅详情</router-link>
                </li>
              </ul>
            </div>
        </div>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
const SUCCESS=200;
export default {
    name: 'app',
    data(){
      return {
        notice:{}
      }
    },
    created(){
        //获取链接中的数据，缓存备用
        let token = this.$route.params.token;
        let storeId = this.$route.params.storeId;
        let tableId = this.$route.params.tableId;
        let tableName = this.$route.params.tableName;
        if(token){
            localStorage.setItem("storeId",storeId);
            localStorage.setItem("tableId",tableId);
            localStorage.setItem("token",token);
            localStorage.setItem("tableName",tableName);
        }
        let _this=this;
        _this.$http.get(
            '/fastfood/findActivityInfo',
            {
                params:{
                    storeId:localStorage.getItem("storeId")
                }
            }
        ).then((res) => {
          console.log(res);
          let data = res.data;
          if(data.code==SUCCESS){
            if(data.model){
                _this.notice = data.model;
            }
          }
        })
    },
    methods:{
        routeOrder(){
            //绝对路径需要加'/'
            this.$router.push('/alreadyOrderlist')
        },
        routeUserCenter(){
            this.$router.push('/userCenter')
        }
    }
}
</script>
<style>
    .order-head{
        width: 100%;
        position: fixed;
        z-index: 2;
        top: 0;
        background: #fff;
    }
    .head{
        padding:0 5px;
        height: 40px;
        line-height: 40px;
    }
    .head button{
        padding: 10px 10px 0;
        border: none;
        background: none;
        outline: none;
    }
    .head button i{
        vertical-align: middle;
        font-size: 20px;
        line-height: 20px;
    }
    .head button.pull-right i{
        margin-right: 5px;
    }
    .tab-ul {
        height:42px;
        overflow: hidden;
        border-top: 1px solid #d8d8d8;
        border-bottom: 1px solid #d8d8d8;
    }
    .tab-ul ul li{
        width: 50%;
        float: left;
    }
    .tab-ul ul li a{
        display: block;
        width:100px;
        padding: 10px;
        text-align: center;
        text-decoration: none;
        color: #7a7a7a;
        margin: 0 auto
    }
    .tab-ul ul li a.active{
        color: #11bcb4;
        border-bottom:1px solid #11bcb4;
    }
    .notice{
        /*padding:6px 10px 4px;*/
        height:30px;
        line-height:30px;
        padding:0 12px;
        background:#c4e8e8;
        font-size: 14px;
        color: #317d7b
    }
    .notice i{
        margin-right:3px;
        vertical-align: middle;
    }
</style>