import { dealWithUrl } from './send'
import { TYPE } from '../utils/type'
/**
 * 
 * @param {*} url 上报接口地址 
 * @param {*} obj 上报的数据对象
 */
export const PV = function(url,obj){
    obj.type = TYPE.PV
    dealWithUrl(url,obj)
}