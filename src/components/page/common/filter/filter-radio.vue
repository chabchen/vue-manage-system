<template>
    <el-radio-group class="radio-group" v-model="radioData.value">
        <el-radio-button v-for="item in radioData.items" :key="item.index" :label="item.label"/>
    </el-radio-group>
</template>

<script>
export default {
    props: { prop: Object },
    data() {
        return {
            radioData:{}
        }    
    },
    created() {
        this.radioData = this.prop.config.radioData;
    }
}
</script>
<style scoped>
.radio-group{
    margin-bottom: 30px;
}
</style>