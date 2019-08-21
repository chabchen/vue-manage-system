<template>
    <div class="wrapper">
        <div class="wrap" style="height: 100px;">
            <div class="item" style="margin: auto">
                <div class="c_title"  style="text-align: center">
                    浏览量
                    <i class="checkbox" style="float: right;margin: 10px 25px 0 -25px;">
                        <el-checkbox v-model="checked"/>
                    </i>                    
                </div>
                <div style="text-align: center">
                    <b>350</b>
                    <i>次</i>
                    <strong class="iconfont"></strong>                        
                </div>
                <div class="bottom" style="text-align: center">
                    <span>
                        环比
                        <b style="color:#ff9d1e">350</b>
                        <i style="color:#ff9d1e">%</i>
                    </span>
                    <span>&emsp;&emsp;</span>
                    <span>
                        同比
                        <b>350</b>
                        <i>%</i>
                        <i class="iconfont"></i>
                    </span>
                    <p>
                        <span>
                            环比
                            <b style="color:#ff9d1e">350</b>
                            <i style="color:#ff9d1e">%</i>
                        </span>
                        <span>&emsp;&emsp;</span>
                        <span>
                            同比
                            <b>350</b>
                            <i>%</i>
                            <i class="iconfont"></i>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
     
    },
    data() {
      return { checked: false}
    },
    mounted() {
      
    },
    methods: {},
    watch: {},
    created() {}
  }
</script>


<style scoped>
.wrapper{
   width: 300px;
}
.wrap{
   border-radius: 30px;
   border: 2px solid #0084D5;
}
.bottom{
   overflow: hidden;
   padding-bottom: 22px;
   border-top: 1px solid #0084D5;
   width: 80%;
   height: 20%;
   margin: auto;
}
</style>