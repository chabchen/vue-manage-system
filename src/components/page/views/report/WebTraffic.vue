<template>
    <div class="container">
        <div style="text-align: left">
            <filterRadio/>
        </div>
        <div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
            <div class="card">
                <filterCard/>
            </div>
        </div>   
        <div class="container" style="width: 100%;height: 30%;">
            <div class="schart-box">
                <schart class="schart" canvasId="line" :data="data1" type="line" :options="options2"></schart>
            </div>
        </div>
        <div>
            <uiTable/>
        </div>
    </div>
</template>

<script>

import filterRadio from "../../common/filter/filter-radio.vue";
import filterCard from "../../common/filter/filter-card.vue";
import uiTable from "../../common/table/table.vue";
import Schart from 'vue-schart';
export default {
    components: {
        filterRadio,filterCard,Schart,uiTable
    },
    data: () => ({
            data1:[
                {name:'2012',value:1141},
                {name:'2013',value:1499},
                {name:'2014',value:2260},
                {name:'2015',value:1170},
                {name:'2016',value:970},
                {name:'2017',value:1450}
            ],
            options2: {
                title: '趋势图',
                //bgColor: '#D5E4EB',
                titleColor: '#00887C',
                fillColor: '#0084d5',
                contentColor: 'rgba(46,199,201,0.3)'
            }
    }),
    mounted() {
    
    },
    methods: {},
    watch: {},
    created() {}
}
</script>


<style scoped>
.card{ 
     float: left;
} 
#line{
   width: 100%;
   height: 30%;
}
</style>
      