<template>
    <div class="store-detail">
        <div class="separate"></div>
        <div class="detail-wrapper">
          <img :src="store.logoUrl" alt="logo" width="50" height="50">
          <span>{{store.storeName}}</span>
        </div>
        <div class="separate"></div>
        <div class="detail-cell">
          <i class="iconfont icon-address colorgray"></i>
          <span>{{store.storeCity+store.storeAddress}}</span>
        </div>
        <div class="detail-cell">
          <i class="iconfont icon-boda colorgray"></i>
          <span>{{store.phone}}</span>
        </div>
        <div class="separate"></div>
        <div class="detail-cell">
          营业时间
          <span class="pull-right">{{store.startTime}}-{{store.stopTime}}</span>
        </div>
        <div class="detail-cell" v-if="store.storeDesc">
          门店介绍
          <p>{{store.storeDesc}}</p>
        </div>
    </div>
</template>
<script>
    const SUCCESS=200;
    export default {
      data(){
        return {
          store:{}
        }
      },
      activated(){
        let _this=this;
        let  storeId = localStorage.getItem("storeId");
        _this.$http.get(
            '/fastfood/selectStoreDetailsInfoAndByLogo',
            {
                params:{
                    storeId:storeId
                }
            }
        ).then((res) => {
          console.log(res);
          let data = res.data;
          if(data.code==SUCCESS){
            _this.store = data.model;
          }
        })
      }
    }
</script>
<style lang="stylus">
  .colorgray
    color:#a5a2a2;
  .store-detail
    padding-top:112px;
  .isNotice
    .store-detail
      padding-top:82px;
  .separate
    height:10px;
    background #f1f1f1
  .detail-wrapper
    padding 15px
    background #fff
    img,span
      vertical-align middle
      margin-right:5px
  .detail-cell
    padding 15px
    background:#fff
    position relative
    &:before
      content:''
      height:1px
      position:absolute
      bottom:0
      left 15px
      right 0
      background #f2f2f2
    &:last-child:before
      display none
</style>