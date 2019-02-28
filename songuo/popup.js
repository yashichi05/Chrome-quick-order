//新增監聽?
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
            if (result.prd.length == 0) { //無款式


                //輸出顯示
                input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                    result.orderid + "	" + result.cusname + "	" + result.tel + "	" + prd_iso + "	" + result.prdname + "	" + prd_type + "	" + result.option.split("入")[0] + "	" + result.option + "	" + result.prdprice + "	" + result.fee + "	" + result.discount + "	" + result.allprice + "	" + result.receipt + "	" + result.ship + "\n";
            } else { //有款式

                for (var i = 0; i < result.prd.length; i++) {
                    input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                        result.orderid + "	" + result.cusname + "	" + result.tel + "	" + "	" + result.prdname + "	" + result.prd[i].split("*")[0] + "	" + result.prd[i].split("*")[1].split("(")[0].replace(" ", "");
                    if (i == 0) { //訂單第一列
                        input1.value += "	" + result.option + "	" + result.prdprice + "	" + result.fee + "	" + result.discount + "	" + result.allprice + "	" + result.receipt + "	" + result.ship + "\n"
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
