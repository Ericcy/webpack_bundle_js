import { dealWithUrl } from './send'
import { TYPE } from '../utils/type'
export const PV = function(url,obj){
    obj.type = TYPE.PV
    dealWithUrl(url,obj)
}