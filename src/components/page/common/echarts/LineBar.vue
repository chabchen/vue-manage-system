<template>
<ve-histogram 
:data="chartData" 
height="500px"
:extend="chartExtend"
:colors="chartColor"
:legend-visible="true"
:loading="loading"
:data-empty="dataEmpty"
:settings="chartSettings"/>
</template>

<script>
export default {
    data () {
    this.chartSettings = {
        //yAxisName:'头',
        showLine: ['下单用户','下单率']
    }
    return {
        chartData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 2232 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 223 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 2276 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 1234 },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 4222 },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 5278 }
        ]
        },
        chartExtend:{
            series: {
                symbolSize: 10,
                label: {normal: {show: true}}
            }
        },
        chartColor: ['#89dd47', '#3cabf4'],
        loading: false,
        dataEmpty: false
    }
    }
}
</script>