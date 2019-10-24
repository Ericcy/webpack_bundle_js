import { ajax } from './ajax'
import { TYPE } from '../utils/type'
export const PV = function(obj,cb){
    ajax({
        type: 'get',
        data: {
            sessionId: obj.sessionId || '',
            userid: obj.userid || '',
            pagename: obj.pageName || '',
            pageurl: obj.pageUrl || '',
            currenttime: obj.currentTime || '',
            event: TYPE.PV || ''
        }
    },cb)
}