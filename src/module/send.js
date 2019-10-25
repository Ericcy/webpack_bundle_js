import { utils } from '../utils/utils'
export function dealWithUrl(url, obj) {
    let objStr = utils.changeJSON2Query(obj)
    let urlLength = (url + (url.indexOf('?') < 0 ? '?' : '&') + objStr).length;
    if (urlLength < 2083) {
        imgReport(url, obj);
    } else if (navigator.sendBeacon) {
        sendBeacon(url, obj);
    } else {
        xmlLoadData(url, obj);
    }
}

function sendBeacon(url, data) {
    data.currentTime = new Date().getTime();
    data.pageurl = location.href;
    let headers = {
        type: 'application/x-www-form-urlencoded'
    };
    let blob = new Blob([JSON.stringify(data)], headers);
    navigator.sendBeacon(url, blob);
}

function imgReport(url, data) {
    if (!url || !data) {
        return;
    }
    data.currentTime = new Date().getTime();
    data.pageurl = location.href;
    let image = document.createElement('img');
    let objStr = utils.changeJSON2Query(data)
    let name = 'img_' + (+new Date());
    image.onload = image.onerror = function () {

    };
    let newUrl = url + (url.indexOf('?') < 0 ? '?' : '&') + objStr;

    image.src = newUrl;
}

function xmlLoadData(url, data) {
    data.currentTime = new Date().getTime();
    data.pageurl = location.href;
    var client = null;
    if (window.XMLHttpRequest) {
        client = new XMLHttpRequest();
    } else {
        client = new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    client.open("POST", url, false);
    client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    client.send(JSON.stringify(data));
}
