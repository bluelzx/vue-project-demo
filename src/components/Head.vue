<template>
    <div class="head clearfix">
        <button type="button" @click="$router.go(-1)" class="pull-left"><i class="iconfont icon-fanhui"></i></button>
        个人中心
    </div>
</template>
<script>
    export default {
        methods:{
            routeOrder(){
                //绝对路径需要加'/'
                this.$router.push('/orderlist')
            },
            routeUserCenter(){
                this.$router.push('/userCenter')
            }
        }
    }
</script>
<style lang="">
    .head{
        padding: 10px;
    }
</style>