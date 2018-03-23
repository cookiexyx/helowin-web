<template>
	<el-container id="cockpit">
		<el-aside width="200px">
			<containerSidebar></containerSidebar>
		</el-aside>
		<el-container>
			<el-header>
				<h2>Header</h2>
			</el-header>
			<el-main>
				<SlowIllness class="echarts-item"></SlowIllness>
				<TaskOverview class="echarts-item"></TaskOverview>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import ContainerSidebar from "@/views/common/containerSidebar"
import TaskOverview from "@/views/common/echarts/TaskOverview"
import SlowIllness from "@/views/common/echarts/SlowIllness"
export default {
  components: {
		ContainerSidebar,
		TaskOverview,
		SlowIllness,
	},
	data(){
		return{

		}
	},
  mounted(){

  },
	methods:{

	}
}
</script>

<style lang="scss">
.el-header{
	line-height: 60px;
	text-align: center;
	border-bottom: 1px solid #ccc;
	h2{
		margin: 0;
	}
}
.echarts-item{
	float: left;
}
</style>

