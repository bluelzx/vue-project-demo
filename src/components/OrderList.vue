<template>
    <div>
        <div class="order-title">
            <span class="pull-left">{{item.addtime}}</span>
            <span class="pull-right">{{item.status | orderStatus}}<span v-show="item.status==4 || item.status == 3" :class="{colorBrown:item.evaluateStatus==0}">（{{item.evaluateStatus | commentStatus}}）</span>
            </span>
        </div>
        <div class="order-info">
            <div class="store-avatar">
                <img slot="icon" :src="item.storeLogoUrl" width="70" height="70">
            </div>
            <div class="order-text">
                <p class="store-name">{{item.storeName}} <span v-show="item.orderType==2"><i class="iconfont pindan icon-pin"></i></span></p>
                <p class="clearfix col999">
                    <span class="pull-left" v-show="item.peopleNumber==0">共点了{{item.totalWeight}}份 / 就餐号{{item.eatNumber}}</span>
                    <span class="pull-left" v-show="item.peopleNumber!=0">{{item.peopleNumber}}人共点了{{item.totalWeight}}份</span>
                    <span class="pull-right">共计<b>¥{{item.totelprice}}</b></span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    import '../filter/status.js'
    export default {
        props: {
            item: Object
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

    .order-list
        background-color:#f1f1f1;
        border-top: 10px solid #f1f1f1;
        li
            padding:0 plr;
            padding-bottom:10px;
            background-color:#fff;
            margin-bottom:10px;
            a
                text-decoration:none;
                color:#333;
        .order-title
            @extend $po-rela;
            line-height: 36px;
            height: 36px;
            color: #a1a1a1;
            font-size: fz;
            overflow:hidden;
            &:after
                bor-line()
        .store-avatar
            position: absolute;
            top: 8px;
            left: 0;
            w-h(70px);
            overflow: hidden;
    .order-info
        @extend $po-rela;
        overflow: hidden;
        padding: 10px 0 10px 80px;
        .store-name
            margin: 5px 0 10px;
            font-size: fz + 4px;
        .order-text
            @extend $po-rela;
        .col999
            color:#999;
            font-size:fz +1px;
            b
                padding-left: 5px;
                font-size: fz + 3px;
                color: #333;
    .colorBrown
        color:#ef6500;

    .noorder,
    .norecord
        padding-top: 120px;
        text-align: center;
        color: #999;
        font-size: 13px;
    .noorder
        background:#f1f1f1 url("../assets/image/noorder.png") no-repeat center center;
        background-size: 52px 58px;
    .norecord
        background:#f1f1f1 url("../assets/image/norecord.png") no-repeat center center;
        background-size: 56px 59px;
</style>