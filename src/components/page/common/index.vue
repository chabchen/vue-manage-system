<template>
    <div class="container">
        <async-load-comp v-for="(key,index) in comps" :key="index" :app="key" :prop="prop"></async-load-comp>
    </div>
</template>
<script>
import asyncLoadComp from './asyncLoadComp.vue'
    export default {
    components: {asyncLoadComp},
    data () {return {
        comps: ['filter/filter-radio','filter/filter-card','filter/filter-card', 'echarts/LineBar','echarts/Line'],
        prop: {name: '张三'}}}
}
</script>