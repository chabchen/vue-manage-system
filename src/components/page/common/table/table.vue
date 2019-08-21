<template>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="date" label="店铺" > </el-table-column>
        <el-table-column prop="name" label="访客数" > </el-table-column>
        <el-table-column prop="sss" label="成交人数" > </el-table-column>
        <el-table-column prop="ddd" label="成交转化率" > </el-table-column>
        <el-table-column prop="fff" label="GMV" > </el-table-column>
        <el-table-column prop="ggg" label="人均消费" > </el-table-column>
    </el-table>
</template>

<script>
export default {
    data() {
    return {
        tableData: [{
        date: '天猫',
        name: '333',
        sss: '2222',
        ddd: '2222',
        fff: '2222',
        ggg: '2222'
        }, {
        date: '苏宁',
        name: '333',
        sss: '2222',
        ddd: '2222',
        fff: '2222',
        ggg: '2222'
        }, {
        date: '京东',
        name: '333',
        sss: '2222',
        ddd: '2222',
        fff: '2222',
        ggg: '2222'
        }, {
        date: '拼多多',
        name: '333',
        sss: '2222',
        ddd: '2222',
        fff: '2222',
        ggg: '2222'
        }]
    }
    }
}
</script>