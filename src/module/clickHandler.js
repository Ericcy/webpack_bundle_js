//点击事件的回调
import { utils } from '../utils/utils'
import { dealWithUrl } from './send'

/**
 * @method clickHandler
 * @parame e 点击的对象
 **/
export function  clickHandler(e) {
    let domData = e.target.getAttribute('collect-data') || '';
    console.log(domData);
}