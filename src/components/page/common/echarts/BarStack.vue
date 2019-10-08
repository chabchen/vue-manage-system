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
                chartData: {},
                params:'',
            }
        },
        created() {
            this.loading = false;
            this.chartData = this.prop.config.chartData;
            this.chartSettings = this.prop.config.chartSettings;
        },
        computed: {
            changeParams() {
                return this.prop.params;
            }
        },
        watch: {
            changeParams(newValue) {
                if(!newValue){return;}
                this.params = newValue;
                this.prop.params = "";
            }
        },
        methods:{

            loadReportData(params){
                this.$requestData('/report/list','post',{params:params}).then(res => {
                    
                });
            },
        }
    }
</script>