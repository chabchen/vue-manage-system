<template>
    <ve-histogram :data="chartData" :settings="chartSettings" :loading="loading"/>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: true,
                chartSettings: {},
                chartData: {}
            }
        },
        created() {
            this.loading = false;
            this.chartData = this.prop.config.chartData;
            this.chartSettings = this.prop.config.chartSettings;
        }
    }
</script>