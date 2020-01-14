<template>
    <div id="lineCharts" style="height:350px"></div>
</template>
<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                heightData: '350px',
                option: {}
            }
        },
        mounted: function () {
            this.myChart = this.$echarts.init(document.getElementById('lineCharts'));
            this.loadLineCharts();
        },
        computed: {
            changeParams() {
                return this.prop.option;
            }
        },
        watch: {
            changeParams(value) {
                this.loadLineCharts(value);
            }
        },
        methods: {
            loadLineCharts(value) {
                if (!this.prop.option) { return; }
                this.myChart.setOption(this.prop.option);
            }
        }
    }
</script>
<style scoped>
</style>