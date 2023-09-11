<template>
	<div
		id="gyImgCtrBox"
		class="gy_img_ctr_box"
		:style="{
			display: styleDate.display,
			top:styleDate.top,
			left:styleDate.left,
			opacity:styleDate.opacity
		}"
	>	
		<div class="button_group">
			<div id="GYImgcontrollRank" class="rank" @click="rank">
				<svg-icon name="scale" color="#333" />
			</div>
			<div id="GYImgcontrollSub" class="sub" @click="sub">-</div>
			<div id="GYImgcontrollAdd" class="add" @click="add">+</div>
		</div>
		<div
			v-show="styleDate.isShowRank"
			class="scale_box"
			:style="{ 'top': styleDate.inputTop, 'right': styleDate.inputRight, }"
		>
			<el-input-number
				size="small"
				v-model="styleDate.rankNumber"
				:max="styleDate.rankNumberMax"
				:min="styleDate.rankNumberMin"
				@change="rankNumberChange"
			/>
		</div>
	</div>
</template>

<script lang="ts" name="zeditImgCtrl" setup>
import { defineProps, defineEmits } from 'vue';
import { imgControlStyleData } from '/@/components/sys/QuillEditor/model/zeditModal';

const props = defineProps({
	styleDate:{
		type: Object as ()=>imgControlStyleData,
		required: true
	}
});
const emit = defineEmits(['add','sub','rank', 'rankNumberChange']);
const add = ()=>{ emit( 'add' ); };
const sub = ()=>{ emit( 'sub' ); };
const rank = ()=>{ emit( 'rank', !props.styleDate.isShowRank ); };
const rankNumberChange = ()=>{ emit( 'rankNumberChange', props.styleDate.rankNumber ); };
</script>

<style lang="scss" scoped>
.gy_img_ctr_box{
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	position: absolute;
	top:0px;
	left:0px;
	z-index: 9;
	.button_group{
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
	}
	.add,
	.rank,
	.sub{
		width: 30px;
		height: 30px;
		background-color: white;
		border: 1px solid silver;
		border-radius: 4px;
		font-size: 25px;
		line-height: 25px;
		text-align: center;
		cursor: pointer;
		user-select: none;
	}
	.sub{ margin-right: 9px; }
	.rank{
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		margin-right: 9px;
		padding: 4px 3px 4px 5px;
		background-color: white;
		box-sizing: border-box;
		svg{ width: 20px; height: 20px; }
	}
	.scale_box{
		position: absolute;
		width: 126px;
		height: 30px;
		background: transparent none;
		text-align: right;
	}
}
</style>