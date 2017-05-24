<template>
    <div>
        <table class="menus-table">
            <tr v-for="(item,index) in dishesData">
                <td width="55%">{{item.itemName}}{{filterAttrName(item.menusItemId,item.propertyName)}} <i v-bind:class="{'iconfont':true,'colororg':true,'icon-tui':item.itemStatus==1,'icon-jia':item.itemStatus==2}"></i></td>
                <td width="15%" align="center">x{{item.number}}</td>
                <td width="30%" align="right">¥{{(item.money * item.number).toFixed(2)}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        props: {
            dishesData:Array
        },
        methods: {
            filterAttrName(val,val2){
                if(val2) return "（"+val2+"）";
                var valStr = " " + val;   //将数值转换为字符串
                if(val && valStr.indexOf(':') != -1){
                     return "（" + valStr.split(":")[1] + "）";
                }
                return "";
            },
        }
    }
</script>
<style lang="stylus">
    .colororg
        color:#f96132
    .menus-table
        position:relative
        font-size:14px
        width:100%
        padding:0px 12px 6px
        &:after
            content: ""
            position: absolute
            bottom: 0
            left:12px
            right: 12px
            border-bottom:1px solid #ddd
            -webkit-transform-origin: 0 100%
            transform-origin:0 100%
            -webkit-transform:scaleY(0.5)
            transform:scaleY(0.5)
        td
            height: 42px
            color:#666
</style>