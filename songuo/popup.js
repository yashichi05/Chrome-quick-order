﻿//新增監聽?
chrome.runtime.onMessage.addListener(function (request, sender) {

    if (request.action == "getSource") {
        //讀取已存的ISO商品明細
        chrome.storage.local.get("sg_value", function (items) {
            document.getElementById('isolist').value = items.sg_value

            result = request.source
            //轉ISO資料為html
            var parser = new DOMParser();
            isohtml = parser.parseFromString(items.sg_value, "text/html");



            //搜尋ISO
            var trlist = isohtml.querySelectorAll("tr"); //G表商品列
            var row = -1
            var prd_iso = ""
            var prd_type = ""
            for (ii = 0; ii < trlist.length; ii++) {
                //macth 搜尋字串是否含有特定文字

                if (trlist[ii].querySelectorAll("td")[3].innerHTML == result.prdurl) {
                    var row = ii;
                    result.prdname = trlist[row].querySelectorAll("td")[1].textContent; //有找到則取代網頁產品名
                    prd_iso = trlist[row].querySelectorAll("td")[0].textContent;
                    prd_type = trlist[row].querySelectorAll("td")[2].textContent;
                    break;
                }

            }

            //打訂單
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
            if (result.prd.length == 0) { //無款式


                //輸出顯示
                input1.value += "d08" + "	" + time + "	" +
                    result.orderid + "		" +
                    prd_iso + "	" +
                    result.prdname + "	" +
                    prd_type + "			" +
                    result.option.split("入")[0] + "	" +
                    result.option + "	" +
                    result.prdprice + "	" +
                    result.fee + "	" +
                    result.discount + "	" +
                    result.allprice + "	" +
                    result.receipt + "	" +
                    result.cusname + "	" +
                    result.tel + "	" +
                    result.ship + "\n";
            } else { //有款式

                for (var i = 0; i < result.prd.length; i++) {
                    input1.value += "d08" + "	" + time + "	" +
                        result.orderid + "		" +
                        result.prdname + "	" +
                        result.prd[i].split("*")[0] + "		" +
                        result.allprice + "	" +
                        result.prd[i].split("*")[1].split("(")[0].replace(" ", "");
                    if (i == 0) { //訂單第一列
                        input1.value += "	" +
                            result.option + "	" +
                            result.prdprice + "	" +
                            result.fee + "	" +
                            result.discount + "	" +
                            result.allprice + "	" +
                            result.receipt + "	" +
                            result.cusname + "	" +
                            result.tel + "	" + "	" +
                            result.ship + "\n"
                    } else { //不是第一列則直接換行
                        input1.value += "\n"
                    }


                }

            }



            if (result.orderid.length == 0) {
                input1.value = "無訂單資料";

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
        xhr.open("GET", "https://docs.google.com/spreadsheets/d/19ZXwhENPrLmLURoKO4xXoCDahpyMG5wuU_8xsU74kyI/gviz/tq?tqx=out:html&tq=select%20A,B,C,O&gid=929906211", false);
        xhr.send();
        document.getElementById('isolist').value = xhr.responseText;
        document.querySelector('button').innerHTML = "OK";


        //存入更新資料
        var theValue = document.getElementById('isolist').value;

        chrome.storage.local.set({
            'sg_value': theValue
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
