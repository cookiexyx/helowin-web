<template>
  <div id="taskOverview"></div>
</template>

<script>
export default {
    name:'TaskOverview',
    data(){
        return{

        }
    },
    mounted(){
        this.drawLine();
    },
	methods:{
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('taskOverview'))
        // 绘制图表
        myChart.setOption({
            title: { text: '当月业务完成概况' },
            tooltip: {},
            xAxis: {
                data: ["初诊","复诊","检查项","远程分析","慢病管理","随访"]
            },
            yAxis: {
                max: 100,
                min: 0
            },
            series: [{
                name: '人数',
                type: 'bar',
                label:{
                    normal:{
                        show:true,          
                        position: 'top',
                        color:'#000'     
                    }
                },
                barWidth : 50,
                data: [52, 78, 39, 0, 18, 57]
            }],
            color:['#409EFF']
        });
    }
	}
}
</script>

<style lang="scss">
#taskOverview{
	width: 50%;
	height: 400px;
}
</style>


