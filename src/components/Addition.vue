<template>
<div>
    <div class="addition-box" v-show="serviceList!=''">
        <table class="menus-table">
            <tr v-for="item in serviceList">
                <td width="55%">#附加{{item.chargeName}}</td>
                <td width="15%" align="center">×{{item.quantity?item.quantity:1}}</td>
                <td width="30%" align="right">¥<span>{{item.money}}</span></td>
            </tr>
        </table>
    </div>
</div>
   
</template>
<script>
    export default {
        props: {
            serviceList: Array
        }
    }
</script>
<style lang="stylus">
   .addition-box .menus-table
        font-size:14px
        width:100%
        padding:0px 0 6px
        td
            height: 35px
            color:#666                 
    .addition-box
        position: relative
        margin:0 12px
        &:after
            content: ""
            position: absolute
            bottom: 0
            left:0
            right: 0
            border-bottom:1px solid #ddd
            -webkit-transform-origin: 0 100%
            transform-origin:0 100%
            -webkit-transform:scaleY(0.5)
            transform:scaleY(0.5)
        .addition-box:after
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
</style>