import {BasicPageParams} from "/@/api/model/baseModel";

export  interface OrderQuery {
  pageNum?: number;
  pageSize?: number;
  id?: number;
  orderCode?: string   //订单号
  productName?:string;   //商品名称
  activitiesName?: string;    //活动名称
  receivedPeople?:string;    // 受捐人
  payType?:string;    //付款方式
  orderTime?:any;
  orderStartTime?:string;   //下单时间
  orderEndTime?:string;   //下单时间
  receivedStartTime?:string;  //签收时间
  receivedEndTime?:string;  //签收时间
  orderStatus?:string;
  orderType?: string;
}
export  interface Order{
  orderCode?: string   //订单号
  activitiesName?: string;    //活动名称
  activitiesCode?:string;   //活动编号
  productName?:string;   //商品名称
  productNumber?:number;   //数量
  productPrice?:string;   // 价格
  payType?:string;    //付款方式
  traceNo?:string;    // 物流单号
  orderTime?:string;   //下单时间
  receivedTime?:string;  //签收时间
  orderStatus?:string;    //状态(1-待发货,2-已发货,3-运输中,4-派送中,5-已签收)
  donationPeople?:string;   //捐赠人
  donationPhone?:string;     //捐赠人手机号
  receivedPeople?:string;    // 受捐人
  receivedPhone?:string;      //受捐人手机号
  receivedAddr?:string;
  remark?:string;  //备注
}


export type ActPageParams = BasicPageParams & {};

