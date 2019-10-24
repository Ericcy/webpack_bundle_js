//点击事件的回调
import { dealWithUrl } from './send'
import { utils } from '../utils/utils'

/**
 * @method clickHandler
 * @parame e 点击的对象
 **/
export function  clickHandler(e) {
    //取标签埋点属性
    let domData = e.target.getAttribute('collect-data') || '';
    domData = utils.stringToJSON(domData);

    //有埋点属性采取上报
    if(domData){
        dealWithUrl('url', domData)
    }
}