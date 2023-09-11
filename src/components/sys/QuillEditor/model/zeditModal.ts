// imgControl
export interface imgControlStyleData{
	display: string,
	top: string,
	left: string,
	opacity: number,
	inputTop: string,
	inputRight: string,
	rankNumber: number,
	rankNumberMax: number,
	rankNumberMin: number,
	isShowRank: boolean
}
export interface imgControlProps{
	styleDate: imgControlStyleData
}

// Quill toolbar 标题
export interface titleConfigModal{
	Choice: string,
	title: string,
}

export interface ElementRect{
	bottom: number,
	height: number,
	left: number,
	right: number,
	top: number,
	width: number,
	x: number,
	y: number,
}
export const ElementRectDefault:ElementRect = {
	bottom: 0,
	height: 0,
	left: 0,
	right: 0,
	top: 0,
	width: 0,
	x: 0,
	y: 0,
}
export interface diyELement extends HTMLElement {
	sourceRect: ElementRect,
	scale:number
}
// 当前操作 图片的 信息
export interface editPicModal{
	isShow: false,
	editBox: HTMLElement | null,
	editBoxClientRect: ElementRect,
	el: diyELement | null,
	elClientRect:ElementRect,
	parent: HTMLElement | null,
	parentClientRect: ElementRect,
	ctrlPosition:{
		top: string,
		left: string,
	},
	ctrlEl:HTMLElement | null,
	fileINPUT: HTMLElement | null,
}




