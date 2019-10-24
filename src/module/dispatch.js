//用户自定义采集
import { dealWithUrl } from './send'

/**
 * @method dispatch
 * @parame eType 用户行为类型
 * @parame element 当前点击的对象元素
 * @parame extraInfo 额外信息
 **/
export function dispatch(eType, element, extraInfo){
    dealWithUrl('url', extraInfo)
}