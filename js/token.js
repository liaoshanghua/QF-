
function setCookie(name, value) {
    var time = 24 * 60 * 60 * 1000;
    var exp = new Date().setHours(0, 0, 0, 0);
    var expires = new Date(exp + time);
    document.cookie = name + '=' + escape(value) + ';expires=' + expires.toGMTString() + ';path=/';
}

function getCookie(name) {
    var arr = null;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    var arr = document.cookie.match(reg);
    if (arr) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}
let apsUrl = localStorage.getItem('url');
//     url: 'http://14.116.223.88:9802'+ url,
//axios封装post请求
function axiosPostRequst(url, data) {
    let result = axios({
        method: 'post',
        url: apsUrl + url,
        data: data,
        headers: {
            'token': getCookie("token"),
            'Content-Type': 'application/json'
        }
    }).then(resp => {
        return resp.data;
    }).catch(error => {

    });
    return result;
}

function getParam(key) {
    var lot = location.search;
    var reg = new RegExp(".*" + key + "\\s*=([^=&#]*)(?=&|#|).*", "g");
    return decodeURIComponent(lot.replace(reg, "$1"));
}

//get请求
function axiosGetRequst(url, params) {
    let _this = this
    var result = axios({
        method: 'GET',
        url: apsUrl + url,
        headers: {
            'token': getCookie("token"),
            'Content-Type': 'application/json'
        },
        params: params
    }).then(function (resp) {
        if (resp.status == 401) {
            // window.location.href = "login.html"
            return
        }
        return resp.data;
    }).catch(function (error) {
        // window.location.href = "login.html"
        return "exception=" + error;
    });
    return result;
}