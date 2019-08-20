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
            for (i = 0; i < result.length; i++) {
                if (result[i].sped_prd.length > 2) {
                    var fr = 1
                    //提取 多款式count
                    count_ary = []
                    while (result[i].prd != "") {
                        str_num = result[i].prd.match(/\* [0-9]/)[0] //得到第一個數量 * 1
                        count_ary.push(str_num.replace("*","").replace(" ",""))
                        str_index = result[i].prd.match(/\* [0-9]/)['index'] //得到第一個位置
                        next_start = str_index + str_num.length
                        result[i].prd = result[i].prd.substr(next_start) //下一個開始
                    }

                    for (ii = 0; ii < result[i].sped_prd.length - 1; ii++) {
                        if (fr == 1) {
                            input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                                result[i].orderdown + "	" + result[i].orderid + "	" + result[i].cusname + "		" + result[i].sped_prd[ii] + "	" + result[i].prdtype + "	" + count_ary[ii] + "	" + result[i].prdcounttype + "		" + result[i].ship + "\n"
                        } else {
                            input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                                result[i].orderdown + "	" + result[i].orderid + "	" + result[i].cusname + "		" + result[i].sped_prd[ii] + "	" + result[i].prdtype + "	" + count_ary[ii] + "	" + "\n"

                        }
                        var fr = 0
                    }

                } else {
                    input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                        result[i].orderdown + "	" + result[i].orderid + "	" + result[i].cusname + "		" + result[i].prd + "	" + result[i].prdtype + "	" + result[i].prdcount + "	" + result[i].prdcounttype + "		" + result[i].ship + "\n"
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
