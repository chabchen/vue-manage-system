<template>
    <div class="container">
        <async-load-comp v-for="(item,index) in comps" :key="index" :app="item.app" :prop="item.prop"></async-load-comp>
    </div>
</template>
<script>
import asyncLoadComp from './asyncLoadComp.vue'
export default {
    components: {asyncLoadComp},
    data () {
        return {
            comps: [
                {app:'filter/filter-radio',prop:{name:'张三1'}},
                {app:'filter/filter-card',prop:{name:'张三2'}},
                {app:'filter/filter-card',prop:{name:'张三3'}},
                {app:'echarts/LineBar',prop:{name:'张三4'}},
                {app:'echarts/Line',prop:{name:'张三5'}},
                {app:'table/Table',prop:{
                    tableColumns:[
                        {prop:"date",label:"店铺"},
                        {prop:"name",label:"访客数"},
                        {prop:"sss",label:"成交人数"},
                        {prop:"ddd",label:"成交转化率"},
                        {prop:"fff",label:"GMV"},
                        {prop:"ggg",label:"人均消费222"}
                    ]
                }}
            ]                
       }
    }
}
</script>