//新增監聽?
chrome.runtime.onMessage.addListener(function (request, sender) {

    if (request.action == "getSource") {
        //讀取已存的ISO商品明細
        chrome.storage.local.get("value", function (items) {
            //document.getElementById('isolist').value = items.value
            result = request.source
            //轉ISO資料為html
            var parser = new DOMParser();
            isohtml = parser.parseFromString(items.value, "text/html");

            var found = 0;
            var today = new Date()
            var time
            month_o = (today.getMonth() + 1).toString()
            date_o = today.getDate().toString()
            hour_o = today.getHours().toString()
            min_o = today.getMinutes().toString()
            sec_o = today.getSeconds().toString()
            month_o = ("0" + month_o).slice(-2)
            date_o = ("0" + date_o).slice(-2)
            hour_o = ("0" + hour_o).slice(-2)
            min_o = ("0" + min_o).slice(-2)
            sec_o = ("0" + sec_o).slice(-2)

            time = today.getFullYear().toString() + "-" +
                month_o + "-" + date_o + " " + hour_o + ":" + min_o + ":" + sec_o
            for (i = 0; i < result.length; i++) {
                if (result[i].sped_prd.length > 2) {
                    //提取 多款式count
                    count_ary = []
                    while (result[i].prd != "") {
                        str_num = result[i].prd.match(/\* [0-9]/)[0] //得到第一個數量 * 1
                        count_ary.push(str_num.replace("*", "").replace(" ", ""))
                        str_index = result[i].prd.match(/\* [0-9]/)['index'] //得到第一個位置
                        next_start = str_index + str_num.length
                        result[i].prd = result[i].prd.substr(next_start) //下一個開始
                    }

                    for (ii = 0; ii < result[i].sped_prd.length - 1; ii++) {

                        input1.value += "D09" + "	" +
                            time + "	" +
                            result[i].orderid + "	" +
                            result[i].sped_prd[ii] + "	" +
                            result[i].prdtype + "	" + "	" + "	" + "0" + "	" +
                            count_ary[ii] + "	" + "0" + "	" + "	" + "5" + "	" +
                            result[i].prdcounttype + "	" +
                            result[i].cusname + "			" +
                            result[i].site + "	" +
                            result[i].ship + "\n"

                    }

                } else {
                    input1.value += "D09" + "	" +
                        time + "	" +
                        result[i].orderid + "	" +
                        result[i].prd + "	" +
                        result[i].prdtype + "	" + "	" + "	" + "0" + "	" +
                        result[i].prdcount + "	" + "0" + "	" + "	" + "5" + "	" +
                        result[i].prdcounttype + "	" +
                        result[i].cusname + "			" +
                        result[i].site + "	" +
                        result[i].ship + "\n"
                }
            }

        });
    }
});

//執行更新ISO列表
document.addEventListener('DOMContentLoaded', function () {
    var updatebtn = document.getElementById('updatebtn');
    // 偵測案件事件並執行
    updatebtn.addEventListener('click', function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://docs.google.com/spreadsheets/d/19ZXwhENPrLmLURoKO4xXoCDahpyMG5wuU_8xsU74kyI/gviz/tq?tqx=out:html&tq=select%20B,C,D&gid=0", false);
        xhr.send();
        document.getElementById('isolist').value = xhr.responseText;
        document.querySelector('button').innerHTML = "OK";


        //存入更新資料
        var theValue = document.getElementById('isolist').value;

        chrome.storage.local.set({
            'value': theValue
        }, function () {});
        console.log("OK")

    });


});






//執行JS

function onWindowLoad() {
    var input1 = document.querySelector('#input1');
    //執行JS腳本
    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    }, function () {

        // 錯誤跳出
        if (chrome.runtime.lastError) {
            input1.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });

}
//頁面讀取完畢執行JS
window.onload = onWindowLoad;
