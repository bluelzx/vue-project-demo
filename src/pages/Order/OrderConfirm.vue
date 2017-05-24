<template>
    <div>
        <mt-header title="订单确认">
            <mt-button icon="back" slot="left" @click="goMenulist()">返回</mt-button>
        </mt-header>
        <div class="confirm-box">
            <div class="cell table-box clearfix">
                <span class="pull-right">{{tableName}}</span>
                餐桌
            </div>
            <div class="already-dishes-box">
                <div class="cell cell-bor">
                    <a href="javascript:;" @click.stop.prevent="clearCat()" class="clear-cat pull-right"><i class="iconfont icon-delete"></i> 清空购物车</a>
                    已点菜品（{{dishesTotal}}份）
                </div>
                <DishesItem :dishesData="dishesList"></DishesItem>
            </div>
            <Addition :serviceList="serviceCharges"></Addition>
            <div class="favorable-detail" v-if="activeType!=''">
                <div class="clearfix">
                    <span class="pull-right">- ¥{{paidDiscountMoney}}</span>
                    <span class="color999"><i class="iconfont icon-hui"></i>{{activityName}}</span>
                </div>
            </div>
            <div class="favorable-detail">
                <span class="pull-right">应付 <span class="price">¥{{paidMoney}}</span></span><span class="color999">合计 ¥{{totalMoney}}</span>
                <span v-show="activeType!=''" class="already-discount color999">优惠¥{{paidDiscountMoney}}</span>
            </div>
            <div class="remark-box">
                <div class="cell cell-bor">订单备注</div>
                <div class="remark-items plr12">
                    <ul>
                        <li @click="remarkChecked=1" :class="{'checked':remarkChecked==1}">不要辣</li>
                        <li @click="remarkChecked=2" :class="{'checked':remarkChecked==2}">少放辣</li>
                        <li @click="remarkChecked=3" :class="{'checked':remarkChecked==3}">多放辣</li>
                    </ul>
                    <input type="hidden" v-model="remarkChecked">
                    <span v-for="(item,index) in remarkItem" :class="{'checked':item.checked}" @click="checkedItem(item)">{{item.name}}</span>
                    <input type="text" v-model="remarkInput" placeholder="其它偏好或要求">
                </div>
            </div>
             <div class="invoice-box" v-show="showInvoice">
                <div class="open-btn cell-bor cell">
                    是否需要发票
                    <div class="pull-right"><mt-switch v-model="openInvoice"></mt-switch></div>
                </div>
                <div class="plr12" v-show="openInvoice">
                    <div class="invoice-type">类型：
                        <span v-show="hasPaper" @click="typeChecked=true"><i :class="{'iconfont':true,'icon-radio':!typeChecked,'icon-radio-checked':typeChecked}"></i> 纸质</span>
                        <span v-show="hasElec" @click="typeChecked=false"><i :class="{'iconfont':true,'icon-radio':typeChecked,'icon-radio-checked':!typeChecked}"></i> 电子</span></div>
                    <div class="invoice-type">抬头：
                        <span @click="titleChecked=true"><i :class="{'iconfont':true,'icon-radio':!titleChecked,'icon-radio-checked':titleChecked}"></i> 公司</span>
                        <span @click="titleChecked=false"><i :class="{'iconfont':true,'icon-radio':titleChecked,'icon-radio-checked':!titleChecked}"></i> 个人</span></div>
                    <div class="invoice-input">
                        <input type="text" v-show="titleChecked" v-model="invoiceHeader" name="invoiceHeader" placeholder="输入发票抬头信息">
                        <input type="email" v-show="!typeChecked" v-model="email" name="email" placeholder="输入电子发票邮箱">
                    </div>
                </div>
            </div>
             <div class="footer">
                <div class="plr12 clearfix">
                    <div class="pull-left">
                        <p>应付：<span class="money">¥{{paidMoney}}</span></p>
                        <p class="count">已点{{dishesTotal}}份</p>
                    </div>
                    <a href="javascript:void(0);" @click="showDialog=true" class="btn-green w-30 pull-right">立即下单</a>	
                </div>
            </div>
        </div>
        <div class="fri-box" v-show="showDialog">
            <div class="fri-title"><span class="line-left"></span>温馨提示<span class="line-right"></span></div>
            <div class="fri-img"><img src="../../assets/image/alert.png" alt=""></div>
            <div class="fri-btn" ><a href="javascript:;" @click.self.stop="commitForm()" class="btn-green">我知道了</a></div>
        </div>
        <div class="desk-bg" v-show="showDialog"></div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { Switch,Toast,MessageBox} from 'mint-ui';
    import Addition from '../../components/Addition.vue'
    import DishesItem from "../../components/DishesItem.vue"
    
    Vue.component(Switch.name, Switch);
    Vue.component(Toast.name, Toast);   
    Vue.component(MessageBox.name, MessageBox);   
    // let orderId = sessionStorage.getItem("orderId");
    export default {
        data() {
            return {
                showInvoice:false,
                openInvoice:false,
                hasPaper:true,
                hasElec:true,
                typeChecked:true,
                titleChecked:true,
                tableName:"",
                remarkChecked:0,
                remarkStr:"",
                remarkInput:"",
                remarkItem:[
                    {name:'少放酱油'},
                    {name:'少放盐'},
                    {name:'多点醋'},
                    {name:'不要香菜'},
                    {name:'不要洋葱'}
                ],
                invoiceHeader:"",   //发票抬头
                email:"",   //发票邮箱
                activityName:"",    //活动名称
                invoiceType:0, //发票类型
                totalMoney:0,   //总金额
                paidDiscountMoney:0,    //优惠金额
                paidMoney:0,    //应付金额
                serviceCharges: [],
                dishesList:[],
                activeType:'',
                showDialog:false,   
                dishesTotal:0,     //菜品份数
            }
        },
        activated() {
            //获取附加费
            let _this = this;
            _this.tableName = localStorage.getItem("tableName");
            _this.dishesTotal = 0;  //重置已点菜品份数
            _this.totalMoney = 0;   //重置总价格
            _this.dishesList = [];  //重置菜单列表
            _this.remarkChecked = 0; //重置菜品属性
            _this.paidDiscountMoney = 0;
            _this.remarkItem = [
                    {name:'少放酱油'},
                    {name:'少放盐'},
                    {name:'多点醋'},
                    {name:'不要香菜'},
                    {name:'不要洋葱'}
            ];
            let menusId = sessionStorage.getItem("menusId");
            _this.$http.get('/fastfood/storeServiceCharge',{
                params :{
                    menusId:menusId
                }
            }).then((res) => {
                if(res.data.code==200){
                    _this.serviceCharges = res.data.model;
                    let serviceChargesMoney = 0;
                    //计算附加费的总价格
                    if(_this.serviceCharges){
                        for(var i=0;i<_this.serviceCharges.length;i++){
                            serviceChargesMoney += parseFloat(_this.serviceCharges[i].money);
                        }
                    }else{
                        _this.serviceChargeDate="";
                    }

                    _this.totalMoney = (parseFloat(_this.totalMoney) + serviceChargesMoney).toFixed(2);
                }
                //获取优惠信息
                this.getDiscount(_storeId);
            })
            //获取缓存的菜品数据
            let _sessionData = JSON.parse(sessionStorage.getItem("selectFoods"));
            //计算菜品价格
            _sessionData.forEach((item) => {
                let _attribute = item.attribute;
                let _id = item.menusItemId;
                let _menusItemId ="";
                let _attributeItemsId = "";
                let _price = item.price * item.count;
                let _count = item.count;
                if(_attribute){ //有属性
                    _attribute.forEach((subItem) => {
                         if(subItem.count){
                            _menusItemId = subItem.menusItemId+":"+subItem.dishesPropertyItem.itemName;
                            _attributeItemsId = subItem.menusItemId+":"+subItem.itemId;
                            _price = subItem.money * subItem.count;
                            _count = subItem.count;
                            let obj = {
                                id: _id,
                                number: _count,
                                money: subItem.money,
                                itemName: item.dishesName,
                                menusItemId: _menusItemId,
                                attributeItemsId: _attributeItemsId,
                                sort: item.dishesSortId,  //菜品分类id
                                pageSortId: subItem.id,  //菜品属性分类id
                                itemId: subItem.itemId   //菜品属性id
                            }
                            _this.dishesTotal += _count;
                            _this.totalMoney += parseFloat(_price);
                            _this.dishesList.push(obj);
                        }
                    })
                }else{  //无属性
                    let obj = {
                        id: _id,
                        number: _count,
                        money: item.price,
                        itemName: item.dishesName,
                        sort: item.dishesSortId //菜品分类id
                    }
                    _this.dishesTotal += _count;
                    _this.totalMoney += parseFloat(_price);
                    _this.dishesList.push(obj);
                }
            })
             _this.totalMoney = _this.totalMoney.toFixed(2);
            let _storeId = localStorage.getItem("storeId");
          
            //判断是否设置了发票信息
            this.checkHasInvoince(_storeId);
        },
        components: {
            Addition,
            DishesItem
        },
        methods: {
            clearCat(){
                let _this = this;
                MessageBox.confirm('确定执行此操作?').then(action => {
                    //清空购物车数据
                    sessionStorage.removeItem("selectFoods");
                    sessionStorage.setItem("clearCat","1");
                    _this.goMenulist();
                },err=>{
                    console.log(err);
                });
            },
            goMenulist(){
                //跳转到点餐列表页
                let _token = localStorage.getItem("token");
                let _tableName = localStorage.getItem("tableName");
                let _tableId = localStorage.getItem("tableId");
                let _storeId = localStorage.getItem("storeId");
                this.$router.push("/order/menuList/"+_storeId+"/"+_tableId+"/"+_token+"/"+_tableName);
            },
            checkedItem(item) {
                if(typeof item.checked == 'undefined'){
                    this.$set(item,"checked",true);
                }else{
                    item.checked = !item.checked;
                }
            },
            checkHasInvoince(storeId){  //是否设置发票信息
                this.$http.get('/fastfood/couldPrinInvoice',{
                    params: {
                        storeId:storeId
                    }
                }).then((res) => {
                    let _res = res.data;
                    if(_res.code == 200){
                        let _isInvoice = _res.model.isInvoice;  //1开通了发票
                        let _type = _res.model.ticketType;  //0所有，1电子发票，2纸质发票
                        if(_isInvoice == 1){
                            this.showInvoice = true;
                            if(_type && _type==1){  //只配置电子发票
                                this.hasPaper = false;
                                this.typeChecked = false;
                            }else if(_type&&_type==2){
                                this.hasElec = false;
                            }
                        }else{
                            this.showInvoice = false;
                        }
                        //获取已有发票信息
                        this.getInvoice(_type);
                    }
                });
            },
            getInvoice(invoiceType){    //获取已存在的发票信息
                let _token = localStorage.getItem("token");
                this.$http({
                    method:'get',
                    url:'/fastfood/latelyRiseInvoice',
                    headers: {'Authorization':'Basic '+ _token },
                    params:{
                        invoiceType:invoiceType
                    }
                }).then((res) => {
                    if(res.data.code==200){
                        if(res.data.model){
                            this.invoiceHeader = res.data.model.invoiceHeader;
                            this.email = res.data.model.email;
                        }
                    }
                });
            },
            getDiscount(storeId){   //优惠信息
                this.paidMoney = this.totalMoney;
                this.$http.get('/fastfood/findActivityInfo',{
                    params: {
                        storeId:storeId
                    }
                }).then((res) => {
                    if(res.data.code == 200){
                        if(res.data.model){
                            this.activeType = res.data.model.type;
                            let paramsToJson = JSON.parse(res.data.model.params);
                            //转为json对象
                            let _params = paramsToJson;
                            this.activityName = res.data.model.name;
                            if(this.activeType == 1){ //满减
                                // this.activityName = "点餐满" +_params.allprice+"元减" +_params.jianprice+ "元";
                                if(parseFloat(this.totalMoney) >= parseFloat(_params.allprice)){
                                    this.paidDiscountMoney =  _params.jianprice;
                                }
                            }else{ //打折
                                // this.activityName = "全场菜品" + _params.discount/10 + "折";
                                this.paidDiscountMoney = (Math.round(this.totalMoney*(100-_params.discount))/100).toFixed(2);
                            }
                            this.paidMoney = (this.totalMoney - this.paidDiscountMoney).toFixed(2);
                        }
                    }
                })
            },
            commitForm(){
                let _this = this;
                let _token = localStorage.getItem("token");
                let orderId = sessionStorage.getItem("orderId");
                let tableId = localStorage.getItem("tableId");
                let storeId = localStorage.getItem("storeId");
                this.showDialog = false;
                //备注
                let _dinnerLa = "";     //存储辣味属性
                if(this.remarkChecked==1){
                    _dinnerLa = "不要辣";
                }else if(this.remarkChecked==2){
                    _dinnerLa = "少放辣";
                }else if (this.remarkChecked==3){
                    _dinnerLa = "多放辣";
                }
                let _dinnerTypeArr = [];    //存储多选属性
                this.remarkItem.forEach((item) => {
                    if(item.checked){
                        _dinnerTypeArr.push(item.name);
                    }
                })
                _dinnerTypeArr = _dinnerTypeArr.join(",");
                let _dinnerInput = this.remarkInput;
                if(_dinnerLa == ""){
                    if(_dinnerInput){
                        this.remarkStr = _dinnerTypeArr +"!@#"+_dinnerInput;
                    }else{
                        this.remarkStr = _dinnerTypeArr;
                    }
                }else{
                    if(_dinnerTypeArr){
                        _dinnerTypeArr = "," + _dinnerTypeArr;
                    }
                    if(_dinnerInput){
                        this.remarkStr = _dinnerLa + _dinnerTypeArr +"!@#"+_dinnerInput;
                    }else{
                        this.remarkStr = _dinnerLa + _dinnerTypeArr;
                    }
                }
                if(this.openInvoice){
                     if(this.titleChecked){//输入发票抬头
                        if(this.invoiceHeader==""){
                            Toast("请输入发票抬头");
                            return;
                        }
                    }
                    if(!this.typeChecked){//输入邮箱
                        if(this.email==""){
                            Toast("请输入邮箱");
                            return;
                        }else{
                            let emailRegualr = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                            if(!emailRegualr.test(this.email)){
                                Toast("邮箱格式不正确,请重新输入");
                                return;
                            }
                        }
                    }
                    this.invoiceType = this.typeChecked ? "2" : "1";
                    this.invoiceHeader = this.titleChecked ? this.invoiceHeader : "";
                    this.email = this.typeChecked ? "" : this.email;
                    if(this.typeChecked){//纸质
                        if(this.titleChecked){//公司
                            this.invoiceType = 3;//公司纸质
                        }else{
                            this.invoiceType = 1;//个人纸质
                        }
                    }else{//电子
                        if(this.titleChecked){//公司
                            this.invoiceType = 4;//公司电子
                        }else{
                            this.invoiceType = 2;//个人电子
                        }
                    }
                }else{
                    this.invoiceType = 0;
                    this.invoiceHeader = "";
                    this.email = "";
                }
                let _formData = {
                    order: {
                        orderId :orderId,
                        storeId : storeId,
                        tableId : tableId,
                        remark:this.remarkStr,
                        isInvoice:this.showInvoice,
                        invoiceType:this.invoiceType,
                        invoiceHeader:this.invoiceHeader,
                        email:this.email,
                        activityType:this.activeType,
                        paidMoney:this.paidMoney
                    },
                    menusId: this.dishesList,
                    serviceChargeDate:this.serviceCharges
                }
                _formData = JSON.stringify(_formData);
                console.log(_formData);
                this.$http({
                    method:'post',
                    url:'/fastfood/commitOrder',
                    headers: {
                        'Authorization':'Basic '+ _token,
                        "content-type" : "application/json"
                    },
                    data:_formData
                }).then((res) => {
                    if(res.data.code==200){
                        let _orderId = res.data.order.orderId;
                        sessionStorage.setItem("orderId",_orderId);
                        //调起支付页面
                        this.$router.push("/pay/"+_orderId);
                    }else{
                        alert(res.data.message);
                    }
                });
            }
        }
    }

</script>
<style lang="stylus">
    .color999
        color:#999;
    .plr12
        padding: 0 12px
    $border-top
        border-top:10px solid #f1f1f1
     bor-line()
        content: ""
        left:0
        right:0
        bottom: 0
        display: block
        position: absolute
        border-bottom: 1px solid #ddd
        -webkit-transform-origin: 0 100%
        transform-origin:0 100%
        -webkit-transform:scaleY(0.5)
        transform:scaleY(0.5)
    .favorable-detail
        padding: 12px
        font-size:14px
        position:relative;
        &:after
            bor-line()
        .price
            color:#f96132
            font-size:15px
    .already-discount
        padding-left:10px
    .icon-hui
        color: #f97432
        font-size: 16px
        position: relative
        top: 1px
        padding-right: 5px
    .confirm-box
        margin-top:45px
        margin-bottom:55px
        font-size:14px
        .mint-switch-input:checked + .mint-switch-core
            height:26px;
            border-color: #11bbb4;
            background-color: #11bbb4;
            &:after
                -webkit-transform: translateX(26px);
                transform: translateX(26px);
        .mint-switch-core
            height:26px;
            background: #fff;
            &:before
                height:24px;
            &:after
                width: 24px;
                height: 24px;
                background-color: #fff;
                box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
        .table-box
            @extend $border-top
        .cell
            padding:10px 12px
            position:relative
        .cell-bor:after
            bor-line()
        .already-dishes-box
            @extend $border-top
            position:relative
            &:after
                bor-line()
                left:12px
                right:12px
            .clear-cat
                text-decoration:none
                font-size:13px;
                color:#777;
                .icon-delete
                    vertical-align:middle
        .remark-box
            @extend $border-top
            ul
                display:inline-block
                margin-right:6px
                margin-bottom:8px
                vertical-align:top
                li 
                    float:left
                    padding:2px 5px
                    border:1px solid #b1b1b1
                    border-right:none
                    box-sizing: border-box
                    &:first-child
                        border-top-left-radius:3px
                        border-bottom-left-radius:3px
                    &:last-child
                        border-top-right-radius:3px
                        border-bottom-right-radius:3px
                        border-right: 1px solid #b1b1b1
                    &.checked
                        display:inline-block
                        border:1px solid #11bbb4
                        color:#11bbb4
                        margin-right:-1px
                        margin-left:-1px
                        position:relative
                        z-index:10
            .remark-items
                padding-top:10px
                padding-bottom:10px
                color:#b1b1b1
                span
                    display:inline-block
                    margin-right:6px
                    margin-bottom:8px
                    padding:2px 5px
                    border:1px solid #b1b1b1
                    border-radius:3px
                    vertical-align:top
                    &.checked
                        border-color:#11bbb4
                        color:#11bbb4
                input
                    background-color:#f1f1f1
                    border-color:#f1f1f1
        .invoice-box
            position:relative
            @extend $border-top
            &:after
                bor-line()
            .open-btn
                margin-bottom:15px
                overflow:hidden
            .invoice-type,
            input
                padding-bottom:10px
                margin-bottom:10px
            input
                background-color:#f1f1f1
                border-color:#f1f1f1
            .invoice-type 
                span
                    padding-left:25px
                    .icon-radio-checked
                        color:#11bbb4
        .footer
            border-top:1px solid #ddd
            .pull-left
                padding-top:6px
                line-height:18px
                .money
                    color:#f96132
                    font-size:18px
                .count
                    font-size:12px
                    color:#cdcdcd
            .w-30
                width:35%
            .no-submit
                background-color:#dadada
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
        .fri-title
            text-align:center
            padding-bottom:25px
            position:relative
            .line-left,
            .line-right
                display:inline-block
                width:25px 
                position:relative
                top:-4px
                margin:0 20px
                border-bottom:1px solid #cacaca
        .fri-img img
            max-width:100%
        .fri-btn
            margin:20px 10px 0
    .desk-bg
        height: 100%;
        width: 100%; 
        background-color: rgba(0,0,0,.5); 
        position: fixed;
        z-index: 999;
        top:0;
        left: 0;
</style>