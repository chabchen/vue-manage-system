<template>
    <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
        <el-radio-button label="day">日报</el-radio-button>
        <el-radio-button label="month">月报</el-radio-button>
        <el-radio-button label="year">年报</el-radio-button>
    </el-radio-group>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            tabPosition: 'day'
        }
    },
    mounted() {
        
    },
    methods: {},
    watch: {},
    created() {}
    }
</script>
<style scoped>

</style>