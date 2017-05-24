<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
    name: 'app',
    data(){
      return {
        
      }
    }
}
</script>

<style lang="stylus">
  @import 'assets/css/iconfont.css'
  body,p
      margin: 0;
      padding: 0;
  body
      background-color:#f1f1f1;
  html,button,input
    font-family: "Hiragino Sans GB", "\534E\6587\7EC6\9ED1", STHeiti, "\5FAE\8F6F\96C5\9ED1", "Microsoft YaHei", SimHei, "Helvetica Neue", Helvetica, Arial, sans-serif !important;
  *
    box-sizing: border-box
  img
    max-width 100%;
  ul,li
    list-style: none;
    margin: 0;
    padding: 0;
  .clearfix:after
    content:".";
    display:block;
    height:0;
    clear:both;
    visibility:hidden
  h1,h2,h3,h4,h5,h6,p
    margin: 0;
    padding: 0;
  .pull-left
    float: left;
  .pull-right
    float: right;
  input[type=text],
  input[type=number],
  input[type=email]
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      padding: 8px 10px;
      outline: none;
      border: 1px solid #dadada;
      width:100%;
      border-radius:2px;
  .text-overflow 
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  #app 
    color: #303030;
    background-color:#fff;
  .mint-header
    background-color:#fff;
    color:#333;
    border-bottom:1px solid #ddd;
    position:fixed;
    left:0;
    top:0;
    right:0;
    height:45px;
    z-index:100;
    font-size:16px;
  .footer 
    position: fixed;
    bottom: 0;
    z-index: 999;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #fff;
  .btn-green
    line-height: 38px;
    margin-top: 6px;
    font-size: 16px;
    background: #11bbb4;
    color: #fff;
    text-decoration: none;
    display: block;
    text-align: center;
    border-radius: 5px;
</style>
