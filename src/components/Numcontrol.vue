<template>
    <div class="cartcontrol">
        <transition name="fadeRotate">
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
                <i class="iconfont icon-jianhao inner"></i>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">
            {{food.count}}
        </div>
        <div class="cart-add" @click.stop.prevent="addCart($event)">
            <i class="iconfont icon-jiahao"></i>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    },
    flag: {
      default:0,
      type:Number
    }
  },
  methods: {
    addCart(event) {
      const _this=this;
      if (!_this.food.count) {
        Vue.set(_this.food, 'count', 0)
      }
      _this.food.count++;
      let obj = {
        target:event.target,
        dishesId:_this.food.dishesId,
        count:_this.food.count
      }
      _this.$emit('drop',obj)
    },
    decreaseCart(event) {
      let _this = this;
      if (!this.food.count) {
        return
      }
      this.food.count--;
      let obj = {
        target:event.target,
        dishesId:_this.food.dishesId,
        count:_this.food.count,
        isRefresh:this.flag
      }
      this.$emit('initCartList',obj)
    }
  }
}
</script>
<style lang="stylus">
.cartcontrol
  height 39px;
  overflow hidden
  .cart-decrease
    display inline-block
    padding 6px
    float left
    transition: all .4s linear
    .inner
      line-height 24px
      font-size 24px
      color #a9a9a9
      transition all 0.4s linear
    &.fadeRotate-enter-active, &.fadeRotate-leave-active
      transform translate3d(0,0,0)
      .inner
        display inline-block
        transform rotate(0)
    &.fadeRotate-enter, &.fadeRotate-leave-active
      opacity: 0
      transform translate3d(24px,0,0)
      .inner
        transform rotate(180deg)
  .cart-count
    display inline-block
    vertical-align top
    font-size 10px
    color rgb(147,153,159)
    line-height 26px
    text-align center
    padding 6px 0
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    float left
  .cart-add
    display inline-block
    float left
    vertical-align top
    color rgb(17,186,179)
    line-height 24px
    padding 6px
    & i
        font-size 24px

</style>