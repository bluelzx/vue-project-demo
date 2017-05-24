<template>
  <div class="main">
    <div class="loading" v-show="showLoading"></div>
    <div class="content">
      <div class="menu-sidebar" ref="menuWrapper">
        <ul>
            <li v-for="(menu,index) in goods" @click="selectMenu(index,$event)" :class="{'current':currentIndex==index,'menu-list-hook':true}" >
                {{menu.dishesSortName}}
                <mt-badge size="small" color="#f86134" v-if="menu.total>0">{{menu.total}}</mt-badge>
            </li>
        </ul>
      </div>
      <div class="menu-lists" ref="foodsWrapper" @touchstart="replaceCuIndex=false">
        <ul>
            <li v-for="menu in goods" class="food-list-hook">
                <h2>{{menu.dishesSortName}}</h2>
                <ul>
                    <li v-for="food in menu.list" :class="{'no-dish-wrap':food.status==1}">
                        <img v-if="food.imgUrl" v-lazy="food.imgUrl" @click.stop.prevent="selSpec(food,$event)">
                        <img v-else src="../../assets/image/nodish.png" @click.stop.prevent="selSpec(food,$event)">
                        <h3 class="text-overflow">{{food.dishesName}}</h3>
                        <p>月售{{food.soldNumber}}{{food.units}}</p>
                        <p class="price">￥<b>{{food.price}}</b><small>/ {{food.units}}</small></p>
                        <div class="spec-bt" v-if="food.status==0&&food.attributeStatus==1">
                          <button class="btn-small" @click.self.stop="selSpec(food,$event)">选规格</button>
                          <mt-badge size="small" color="#f86134" v-if="food.attrCount>0">{{food.attrCount}}</mt-badge>
                        </div>
                        <div class="num-wrapper" v-if="food.status==0&&!food.attributeStatus">
                            <Numcontrol :food="food" @drop="drop" @initCartList="initCartList"></Numcontrol>
                        </div>
                        <div class='shouxin' v-show="food.status==1"></div>
                    </li>
                </ul>
            </li>
            <li class="food-list-hook" v-show="goods.length>0"><h2>图片仅供参考 菜品请以实物为准</h2></li>
        </ul>
      </div>
    </div>
    <div class="shopCar">
      <div class="shop-content">
        <div class="shopcar-box" :class="{'animated bounceIn':isAnimate}" @click="listToggle">
            <i class="iconfont icon-iconfontshopcar"></i>
            <span class="num" v-if="totalCount>0">{{totalCount}}</span>
        </div>
        <p>合计:{{totalPrice.toFixed(2)}}元</p>
        <button type="button" :class="{'btn-primary':true,'btn-grey':totalCount<=0}" @click="next">下一步</button>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition
            name="drop"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter"
            tag="div"
          >
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="transHeight">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="setEmpty()">清空购物车</span>
          </div>
          <div class="list-content" ref="foodlist">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <div class="main-content" v-if="!food.attribute">
                  <span class="name text-overflow">{{food.dishesName}}</span>
                  <div class="price">
                    <span>￥{{ (food.price * food.count).toFixed(2)}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <Numcontrol :food="food" :flag="1" @drop="drop" @initCartList="initCartList"></Numcontrol>
                  </div>
                </div>
                <ul v-if="food.attribute">
                  <li class="food" v-for="attr in food.attribute" v-if="attr.count>0">
                    <span class="name text-overflow">{{food.dishesName}}({{attr.dishesPropertyItem.itemName}})</span>
                    <div class="price">
                      <span>￥{{(attr.money * attr.count).toFixed(2)}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <Numcontrol :food="attr" :flag="1" @drop="drop" @initCartList="initCartList"></Numcontrol>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade-backdrop">
      <div class="backdrop" v-show="showBackdrop" @click="listShow=false"></div>
    </transition>
    <food :food="selectedFood" ref="food" @drop="drop" @initCartList="initCartList"></food>
  </div>
</template>
<script>
  import Vue from 'vue'
  //better-scroll
  import BScroll from 'better-scroll'
  import Numcontrol from '../../components/Numcontrol'
  import food from './food.vue'
  import { Popup,Badge,MessageBox} from 'mint-ui';
  import { Lazyload } from 'mint-ui';

  Vue.use(Lazyload);
  Vue.component(Badge.name, Badge);
  Vue.component(Popup.name, Popup);
  Vue.component(MessageBox.name, MessageBox);
  const ERR_OK = 200;
  
  export default {
      name:'MenuList',
      data(){
          return {
              tableName:localStorage.getItem("tableName"),
              isAnimate:false,
              scrollY:0,
              goods:[],
              bestSellers:[],
              listHeight:[],
              dropBalls:[],
              sumMenuList:[],
              listShow:false,
              showLoading:true,
              balls:[
                {
                  show:false
                },
                {
                  show:false
                },
                {
                  show:false
                },
                {
                  show:false
                },
                {
                  show:false
                }
              ],
              selectedFood:{},
              currentIndex:0,
              currentCount:0,
              currentDishesId:0,
              replaceCuIndex:false
          }
      },
      activated(){
          let _clearCat = sessionStorage.getItem("clearCat");
          if(_clearCat=="1"){
            this.selectFoods.forEach((food) => {
                if(food.attribute){
                  food.attribute.forEach(function(val) {
                    val.count =0
                  });
                };
                food.count = 0
            })
            //清空数据
            this.goods.forEach((menu) => {
              menu.list.forEach((food) => {
                if(food.attribute){
                  food.attribute.forEach(function(val){
                    val.count = 0;
                  })
                }
                if(food.count){
                  food.count = 0;
                }
              })
              if(menu.total){
                menu.total = 0;
              }
            })
            sessionStorage.removeItem("clearCat");
          }
      },
      watch:{
        goods: {
          handler: function (val, oldVal) {
            let _this = this;
            val.forEach(function(menu) {
              let menuTotal = 0;
              menu.list.forEach(function(food) {
                //设置有规格商品的总价
                if(food.attribute){
                  let totalPrice=0;
                  let attrCount=0;
                  food.attribute.forEach(function(attr){
                    if(attr.count && attr.count>0){
                      totalPrice+=attr.money*attr.count;
                      attrCount+=attr.count;
                    }
                  });
                  Vue.set(food,'total',totalPrice);
                  Vue.set(food,'attrCount',attrCount);
                  menuTotal+=attrCount;
                };
                if(food.count&&!food.attribute){
                  menuTotal+=food.count;
                }
                
              });
              Vue.set(menu,'total',menuTotal);
            });
            
          },
          deep: true
        }
      },
      created () {
        let _this=this;
        let storeId = localStorage.getItem("storeId");
        _this.$http.get(
            // '/fastfood/selectMenus',
            './static/data.json',
            {
                params:{
                    storeId:storeId
                }
              }
        ).then((res) => {  
          let data=res.data;
          if(data.code==ERR_OK){
            let remaiList = {
              "dishesSortName": "热卖",
              "list" : data.bestSellers.dishesSortList
            };
            let goodlist = data.model.dishesSortList;
            goodlist.unshift(remaiList);
            this.goods=goodlist;
            this.menusId=data.model.menusId;
            localStorage.setItem("storeName",data.model.storeName);
            this.$nextTick(() => {
                this.initScroll(); // 初始化scroll
                this._calculateHeight(); // 初始化列表高度列表
            });
            this.showLoading = false;
          }else{
            this.showLoading = false;
            alert(data.message);
          }
        })
      },
      computed:{
        selectFoods(){
          let foods=[];
          let flag=[];//用于判断是否已经操作过ID
          this.goods.forEach(function(good){
            good.list.forEach((food)=>{
              // alert(flag)
              if(flag[food.dishesId]==undefined){
                flag[food.dishesId] = food.dishesId;
                if(food.count){
                  foods.push(food)
                }
              }
              
            })
          });
          return foods
        },
        totalPrice(){
          let total=0;
          this.selectFoods.forEach(function(food) {
            if(food.attribute){
                total+=food.total;
            }else{
              total+=food.price*food.count
            }
          });
          return total
        },
        totalCount(){
          let total=0;
          this.selectFoods.forEach(function(food) {
            if(food.attribute){
              total+=food.attrCount;
            }else{
              total+=food.count
            }
          });
          return total
        },
        showBackdrop() {
          if (this.listShow && this.totalPrice) {
            return true
          }
          this.listShow = false
          return false
        },
      },
      methods:{
        initScroll(){
          //初始化侧边栏滚动
          let menuScroll = new BScroll(this.$refs.menuWrapper,{
            click:true//打开点击事件
          });
          //初始化菜单列表滚动
          this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
            click:true,
            probeType:3
          });
          let _this = this;
          this.foodsScroll.on('scroll',(pos)=>{
            _this.scrollY=Math.abs(Math.round(pos.y))
            for(let i=0;i<_this.listHeight.length;i++){
              let height1=_this.listHeight[i]
              let height2=_this.listHeight[i+1]
              if(!height2 || (_this.scrollY>=height1 && _this.scrollY<height2)){
                  if(_this.replaceCuIndex){//点击左边菜单
                      return _this.currentIndex;
                  }else{
                      return _this.currentIndex = i;
                  }
                  
              }
            }
          })
        },
        //计算每个分类的高度
        _calculateHeight(){
          let foodList =this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
          let height = 0;
          this.listHeight.push(height);
          for(let i=0;i<foodList.length;i++){
            let item = foodList[i];
            height += item.clientHeight;
            this.listHeight.push(height)
          }
        },
        //选择备注
        selSpec(food,event){
          const _this=this;
          // if(!event._constructed){
          //   return
          // };
          _this.selectedFood = food;
          //如果菜品已卖完
          if(_this.selectedFood.status == 1) return;
          //获取当前菜品的备注
          if(!_this.selectedFood.attribute && food.attributeStatus==1){
            _this.$http.get(
                '/fastfood/findFoodAttributesInfo',
                //'/api/goods',
                {
                    params:{
                        menusItemId:food.menusItemId
                    }
                }
            ).then((res) => {
              let data=res.data;
              if(data.code==ERR_OK){
                _this.goods.forEach(function(good){//循环遍历菜品，处理相同菜品有属性的情况
                  //循环遍历相同
                  good.list.forEach((_food)=>{
                    if(_food.attributeStatus && _food.attributeStatus ==1){//有属性
                      if(_food.dishesId == food.dishesId){
                        if(!_food.attribute){
                            _this.$set(_food,'attribute',data.model);
                            if(!_food.selAttr){
                              _this.$set(_food,'selAttr',_food.attribute[0].itemId);
                            }
                        }
                      }
                    }
                  })

                });
              }
            });
          };
          _this.$refs.food.showFlag=true;
          return false;
        },
        //选择菜单
        selectMenu(index,enent){
          //浏览器没有_constructed
          // if(!enent._constructed){
          //   return;
          // }
        
          this.currentIndex = index;
          if(!this.replaceCuIndex){
            this.replaceCuIndex = true;
          }
          let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
          let el = foodList[index];
          //获取列表dom，并且滚动到对应位置 
          this.foodsScroll.scrollToElement(el,300)
        },
        //小球动画开始
        drop(obj){
          let _this = this;
          //改变相同类别的数量
          this.goods.forEach(function(good){
            good.list.forEach((food)=>{
              let dishesId = "";
              if(food.attributeStatus && food.attributeStatus ==1){//有属性
                if(food.menusItemId == obj.dishesId){//与当前选中的商品相同
                  if(food.attribute){//有配置属性
                    food.attribute.forEach((attr)=>{
                      if(attr.itemId==obj.itemId){
                        if(attr.count){
                          attr.count = obj.count;
                        }else{
                          Vue.set(attr,"count",obj.count);
                        }
                      }
                    })
                  }
                }
              }else{//无属性
                  if(food.dishesId == obj.dishesId){//与当前选中的商品相同
                    if(food.count){
                      food.count = obj.count;
                    }else{
                      Vue.set(food,"count",obj.count);
                    }
                  }
              }
            })
          });
          this.$nextTick(()=>{
            for(let i=0;i<this.balls.length;i++){
              let ball =this.balls[i]
              if(!ball.show){
                ball.show=true;
                ball.el=obj.target;
                this.dropBalls.push(ball);
                return;
              }
            }
          })
        },
        beforeEnter:function(el){
          let count = this.balls.length;
          while(count--){
            let ball =this.balls[count];
            if(ball.show){
              let rect = ball.el.getBoundingClientRect();
              let x = rect.left-32;
              let y = -(window.innerHeight-rect.top-22)
              el.style.display='';
              el.style.webkitTransform = `translate3d(0,${y}px,0)`
              el.style.transform = `translate3d(0,${y}px,0)`
              let inner = el.querySelector('.inner-hook')
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`
              inner.style.transform = `translate3d(${x}px,0,0)`
            }
          }
        },
        enter(el,done){
          let rf = el.offsetHeight;
          this.$nextTick(()=>{
            el.style.webkitTransform = 'translate3d(0,0,0)'
            el.style.transform = 'translate3d(0,0,0)'
            let inner = el.querySelector('.inner-hook')
            inner.style.webkitTransform = 'translate3d(0,0,0)'
            inner.style.transform = 'translate3d(0,0,0)'
            el.addEventListener('transitionend',done)
          });
          this.isAnimate=true;
        },
        afterEnter(el){
          let ball = this.dropBalls.shift();
          this.isAnimate=false;
          if(ball){
            ball.show=false;
            el.style.display='none'
          }
        },
        //动画结束
        //点击购物车
        listToggle() {
          if (!this.selectFoods.length) {
            return
          }
          this.listShow = !this.listShow
          if (this.listShow) {
            this.$nextTick(() => {
              if (!this.foodlistScroll) {
                this._initScroll()
              } else {
                this.foodlistScroll.refresh()
              }
            })
          }
        },
        initCartList(obj) {
          //改变相同类别的数量
          this.goods.forEach(function(good){
            good.list.forEach((food)=>{
              let dishesId = "";
              if(food.attributeStatus && food.attributeStatus ==1){//有属性
                if(food.menusItemId == obj.dishesId){//与当前选中的商品相同
                  if(food.attribute){//有配置属性
                    food.attribute.forEach((attr)=>{
                      if(attr.itemId==obj.itemId){
                        if(attr.count){
                          attr.count = obj.count;
                        }else{
                          Vue.set(attr,"count",obj.count);
                        }
                      }
                    })
                  }
                }
              }else{//无属性
                  if(food.dishesId == obj.dishesId){//与当前选中的商品相同
                    if(food.count){
                      food.count = obj.count;
                    }else{
                      Vue.set(food,"count",obj.count);
                    }
                  }
              }
            })
          });

          if(obj.isRefresh!=0){
            this.$nextTick(()=>{
              this.foodlistScroll.refresh()
            })
          }
        },
        //初始化购物车列表
        _initScroll() {
          this.foodlistScroll = new BScroll(this.$refs.foodlist, {
            click: true
          });
        },
        //清空购物车
        setEmpty() {
          MessageBox.confirm('确定执行此操作?').then(action => {
            this.selectFoods.forEach((food) => {
              if(food.attribute){
                food.attribute.forEach(function(val) {
                  val.count =0
                });
              };
              food.count = 0
            })
            this.goods.forEach((menu) => {
              menu.list.forEach((food) => {
                if(food.attribute){
                  food.attribute.forEach(function(val){
                    val.count = 0;
                  })
                }
                if(food.count){
                 food.count = 0;
                }
              })
              if(menu.total){
                menu.total = 0;
              }
            })
          },err=>{
            console.log(err);
          });
        },
        //下一步
        next(){
          if(this.selectFoods.length>0){
            sessionStorage.setItem('selectFoods',JSON.stringify(this.selectFoods));
            sessionStorage.setItem('menusId',this.menusId)
            this.$router.push('/orderConfirm')
          }
        }
      },
      components:{
          Numcontrol,food
      }
  }
</script>
<style lang="stylus">
  .loading{
      position: fixed;
      top: 0;
      z-index: 999;
      width: 100%;
      height: 100%;
      background: #fff url(../../assets/image/load.gif) no-repeat center 35%;
      background-size: 65%;
  }
  .no-dish-wrap{
      opacity: .7;
  }
  .shouxin{
      position: absolute;
      right: 10px;
      bottom: 7px;
      width: 44px;
      background: #fff url(../../assets/image/shouxin.png) no-repeat center center;
      background-size: cover;
      height: 44px;
  }
  .test{
    position fixed
    left 50%
    top 50%
    z-index 1000
    background #fff
  }
  .main{
    position:relative;
    padding-top: 112px;
  }
  .isNotice
    .main
      padding-top: 82px;
    .content
      top:82px;
  .content{
    position: fixed;
    z-index: 1;
    top:112px;
    left:0;
    bottom:50px;
    width: 100%;
    background: #fff;
  }
  .menu-sidebar{
    width:25%;
    background:#f7fbfc;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    bottom:0
  }
  .menu-sidebar ul>li{
    border-bottom:1px dashed #e4e6e3;
    padding:10px;
    text-align: center;
    font-size: 12px;
    position relative
  }
  .menu-sidebar ul>li.current{
    background: #fff;
    color:#11bab3;
    border-left:2px solid #11bab3
  }
  .menu-sidebar ul>li
    .mint-badge.is-primary
      position absolute;
      right 5px;
      top 5px;
      width:15px;
      height:15px;
      line-height:15px;
    .mint-badge.is-size-small
      padding:0;
  .btn-small{
      background: #11bab3;
      border:none;
      color: #fff;
      padding: 3px 10px;
      border-radius: 10px;
      outline: none;
      font-size: 12px;
  }
  .btn-primary{
      background: #11bab3;
      border:none;
      color: #fff;
      font-size: 16px;
      border-radius: 3px;
      padding: 10px 0;
      width: 100px;
  }
  .btn-grey{
    background-color:#ccc;
  }
  .shopCar{
      position: fixed;
      z-index:20;
      left: 0;
      right: 0;
      background: #fff;
      bottom: 0;
      height: 50px;
      border-top: 1px solid #d8d8d8;
  }
  .shopCar .shop-content
    background #fff
    overflow hidden
    padding-left: 80px;
  .shopCar p{
      float: left;
      line-height: 50px;
      color: #666;
  }
  .shopCar button.btn-primary{
      float:right;
      margin: 5px;
  }
  .shopcar-box{
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #11bab3;
      position: absolute;
      top: -10px;
      left: 10px;
      text-align: center;
  }
  .shopcar-box .num{
    position: absolute;
    right: 0;
    top: 0;
    display: block;
    background: #f86134;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
    border-radius: 50%;
    text-align: center;
  }
  .shopcar-box i{
      color: #fff;
      font-size: 30px;
      line-height: 50px;
  }
  .menu-lists{
      padding-left:25%;
      height: 100%;
  }
  .menu-lists ul li h2{
      font-size: 13px;
      padding: 5px;
      background: #f8fbfb;
      font-weight:normal;
  }
  .menu-lists ul li ul li {
      padding: 10px;
      overflow: hidden;
      position: relative;
  }
  .menu-lists ul li ul li:after{
    content:"";
    position: absolute;
    bottom: 0;
    left:0;
    right: 0;
    border-bottom:1px solid rgba(7,17,27,.1);
    -webkit-transform-origin: 0 100%;
    transform-origin:0 100%;
    -webkit-transform:scaleY(0.5);
    transform:scaleY(0.5);
  }
  .menu-lists ul li ul li img{
      float: left;
      width: 50px;
      height: 50px;
      margin-right: 10px;
  }
  .menu-lists ul li ul li .spec-bt
      position: absolute;
      right:10px;
      bottom:10px;
      .mint-badge
        position absolute
        right -6px
        top -6px
  .menu-lists ul li ul li h3{
      color: #303030;
      font-size: 16px;
      font-weight: normal;
      line-height: 16px;
      margin-bottom:2px;
  }
  .menu-lists ul li ul li p{
      color: #999;
      font-size: 12px;
  }
  .menu-lists ul li ul li p.price{
      color: #f86134;
      font-size: 14px;
      margin-top:3px;
  }
  .menu-lists ul li ul li p.price small{
      color:#999;
      font-size:12px;
      margin-left: 5px;
  }
  .num-wrapper{
      position: absolute;
      right: 4px;
      bottom: 0;
  }
  .ball-container .ball{
      position:fixed;
      left:32px;
      bottom:22px;
      z-index:2;
  }
  .ball-container .ball.drop-enter-active{
    transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
  }
  .ball-container .ball.drop-enter-active .inner{
    width:16px;
    height:16px;
    border-radius:50%;
    background:#11bab3;
    transition:all 0.4s linear;
  }    
  .shopcart-list
      position absolute
      top 0
      left 0
      width 100%
      background white
      transform translate3d(0,-100%,0)
      z-index -1
      &.transHeight-enter-active,&.transHeight-leave-active
        transition all 0.5s
      &.transHeight-enter,&.transHeight-leave-active
        transform translate3d(0,0,0)
      .list-header
        height 40px
        line-height 40px
        background #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          display inline-block
          font-size 14px
          font-weight 200
          color rgb(7,17,27)
          padding-left 18px
        .empty
          position absolute
          right 8px
          font-size 12px
          color rgb(0,160,220)
          padding 0 10px
      .list-content
        max-height 217px
        overflow hidden
        .food
          position relative
          margin 0 18px
          overflow hidden
          border-bottom 1px solid rgba(7,17,27,0.1)
          .main-content
            position relative
            height 48px;
            padding-right 150px
          .name
            display block
            font-size 14px
            color rgb(7,17,27)
            line-height 48px
            font-weight 700
          .price
            font-size 14px
            font-weight 700
            color rgb(240,20,20)
            padding 0 12px 0 18px
            line-height 48px
            position absolute
            right 80px
            top 0px
          .cartcontrol-wrapper
            font-size 14px
            margin-top 6px
            position absolute
            right 0
            top 0px
          ul
            display block
            li.food
              margin 0
              border-bottom none
  .backdrop
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    // backdrop-filter blur(10px)
    background rgba(7,17,27,0.6)
    z-index 2
    &.fade-backdrop-enter-active,&.fade-backdrop-leave-active
      transition opacity 0.5s
    &.fade-backdrop-enter,&.fade-backdrop-leave-active
      opacity 0 
</style>