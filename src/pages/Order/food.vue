<template>
  <div
    class="popup"
    v-show="showFlag"
    >
      <div class="selSpec-container">
          <div class="close" @click.stop.prevent="showFlag=false">
            <i class="iconfont icon-close1"></i>
          </div>
          <h1>{{food.dishesName}}</h1>
          <div class="goods-image">
            <img v-if="food.imgUrl" :src="food.imgUrl">
            <img v-else src="../../assets/image/nodish.png">
          </div>
          <div ref="accLists">
            <div class="acc-lists" v-if="food.attribute">
                <label v-for="(attr,index) in food.attribute">
                    <input type="radio" name="acc" :value="attr.itemId" v-model="food.selAttr">
                    <span>{{attr.dishesPropertyItem.itemName}}</span>
                </label>
            </div>
          </div>
          <div class="spec-footer">
              <span class="total">￥{{selAttrPrice}}</span>
              <div class="spec-numCtrl">
                <div class="cartcontrol">
                  <transition name="fadeRotate">
                      <div class="cart-decrease" v-show="selFood.count>0" @click.stop.prevent="decreaseCart($event)">
                          <i class="iconfont icon-jianhao inner"></i>
                      </div>
                  </transition>
                  <div class="cart-count" v-show="selFood.count>0">
                      {{selFood.count}}
                  </div>
                  <div class="cart-add" @click.stop.prevent="addCart($event)">
                      <i class="iconfont icon-jiahao"></i>
                  </div>
              </div>
                <!-- <Numcontrol :food="selFood" @drop="drop($event,selFood.menusItemId,selFood.count)" @initCartList="initCartList($event,selFood.menusItemId,selFood.count,1)"></Numcontrol> -->
                <!-- <Numcontrol :food="selFood"></Numcontrol> -->
              </div>
          </div>
      </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  //better-scroll
  import BScroll from 'better-scroll'
  import Numcontrol from '../../components/Numcontrol'
  export default {
    props:{
      food: {
        type: Object,
        default:{},
      },
    },
    data() {
      return {
        showFlag: false,
        selArr:this.food.attribute
      };
    },
    // created(){
    //   this.$nextTick(() => {
    //     //初始化菜单列表滚动
    //     this._initScroll();
    //   });
    // },
    methods:{
      addCart(event) {
          const _this=this;
          if (!_this.selFood.count) {
            Vue.set(_this.selFood, 'count', 0)
          }
          _this.selFood.count++;
          let obj = {
            target:event.target,
            dishesId:_this.selFood.menusItemId,
            itemId:_this.selFood.itemId,
            count:_this.selFood.count
          }
          // alert(obj)
          _this.$emit('drop',obj)
      },
      decreaseCart(event) {
          if (!this.selFood.count) {
            return
          }
          this.selFood.count--;
          let obj = {
            target:event.target,
            dishesId:_this.selFood.menusItemId,
            itemId:_this.selFood.itemId,
            count:_this.selFood.count,
            isRefresh:0
          }
          this.$emit('initCartList',obj);

          // this.$emit('initCartList',event.target)
      }
    },
    watch:{
      food:{
        handler: function (val, oldVal) {
          let count=0;
          if(val.attribute){
            val.attribute.forEach(function(v) {
              if(v.count){
                count+=v.count;
              }
            });
            this.$set(val,'count',count);
          }
        },
        deep: true
      }
    },
    computed:{
      selAttrPrice(){
        const _this=this;
        if(_this.food.attribute){
          let price = 0;
          _this.food.attribute.forEach(function(val){
            if(val.itemId==_this.food.selAttr){
              return price = val.money;
            }
          });
          return price;
        }else{
          return _this.food.price
        }
      },
      selFood(){
        const _this = this;
        if(_this.food.attribute){
          let sel = _this.food.attribute[0];
          _this.food.attribute.forEach(function(val,index){
            if(val.itemId==_this.food.selAttr){
              sel= _this.food.attribute[index];
            }
          });
          return sel;
        }else{
          return _this.food;
        }
      }
    },
    components:{
      Numcontrol
    }
  }
</script>
<style lang="stylus">
  .popup{
    position fixed
    top 0px
    left 0px
    bottom 0px
    right 0px
    z-index 25
    background rgba(0,0,0,0.5)
  }
  .selSpec-container
    position absolute
    top 50%
    left 50%
    transform translate(-50%,-50%)
    padding: 10px;
    width 280px;
    background:#fff
    border-radius: 5px;
    .goods-image
        text-align center
        margin 10px 0
        min-height:260px
      .spec-footer
        overflow hidden
        .spec-numCtrl
          float right
        .total
          float left
          color #f86134
          font-size 18px
          line-height 39px
          -moz-user-select: -moz-none;
          -khtml-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
      .acc-lists
        font-size 0
        max-height:62px
        overflow-y:scroll
        -webkit-overflow-scrolling : touch; 
        label
          display inline-block
          margin 0 5px 5px 0
          span
            pointer-events: none;
          input
            display none
            &:checked+span
              background #11bab3
              border-color #11bab3
              color #fff
          span
            padding 5px 10px
            display block
            border 1px solid #ccc
            border-radius 5px
            font-size 12px
  .selSpec-container .close
    position: absolute;
    top: -12px;
    right: -11px;
    line-height:20px;
    text-align center
    width 30px;
    height 30px
    background #fff
    border: 4px solid rgba(0,0,0,0.5);
    border-radius 50%;
    i
      color rgba(0,0,0,0.5)
      font-size: 20px;
  .selSpec-container h1{
      font-weight: normal;
      font-size: 16px;
  }
</style>