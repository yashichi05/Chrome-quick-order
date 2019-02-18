//新增監聽?
chrome.runtime.onMessage.addListener(function (request, sender) {

    if (request.action == "getSource") {
        //讀取已存的ISO商品明細
        chrome.storage.local.get("value", function (items) {
            document.getElementById('isolist').value = items.value
            result = request.source
            //轉ISO資料為html
            var parser = new DOMParser();
            isohtml = parser.parseFromString(items.value, "text/html");

            var found = 0;
            for (i = 0; i < result.prd.length; i++) {
                //搜尋ISO
                var trlist = isohtml.querySelectorAll("tr");
                var row
                found = 0; //有沒有找到東西
                for (ii = 0; ii < trlist.length; ii++) {
                    //macth 搜尋字串是否含有特定文字
                    if (trlist[ii].querySelector("td").innerHTML.match(result.prd[i])) {
                        row = ii;
                        found = 1
                        break;
                    }

                }
                if (result.prd[i] == "") { //如果ISO 是空白 設為沒找到
                    found = 0;
                }
                var today = new Date()
                //寫入訂單資料
                if (found == 1) {
                    //輸出顯示

                    if (i == 0) { //第一次迴圈加入發票金額
                        input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                            result.orderid + "	" + result.account + "	" + result.cusname + "	" + result.tel + "	" + trlist[row].querySelector("td").textContent + "	" + trlist[row].querySelectorAll("td")[1].textContent + "	" + trlist[row].querySelectorAll("td")[2].textContent + "	" + result.prdcount[i] + "	" + Number(result.prdprice[i]) / Number(result.prdcount[i]).toString() + "	" + result.prdprice[i] + "	" + result.ship + "	" + result.shipprice + "	" + result.allprice + "\n";

                    } else {
                        input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                            result.orderid + "	" + result.account + "	" + result.cusname + "	" + result.tel + "	" + trlist[row].querySelector("td").textContent + "	" + trlist[row].querySelectorAll("td")[1].textContent + "	" + trlist[row].querySelectorAll("td")[2].textContent + "	" + result.prdcount[i] + "	" + Number(result.prdprice[i]) / Number(result.prdcount[i]).toString() + "	" + result.prdprice[i] + "\n";
                    }
                } else { //iso找不到，則顯示文字
                    if (i == 0) { //第一次迴圈加入發票金額
                        console.log(result.prdn)
                        input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                            result.orderid + "	" + result.account + "	" + result.cusname + "	" + result.tel + "	" + result.prd[i] + "	" + result.prdn[i] + "		" + result.prdcount[i] + "	" + Number(result.prdprice[i]) / Number(result.prdcount[i]).toString() + "	" + result.prdprice[i] + "	" + result.ship + "	" + result.shipprice + "	" + result.allprice + "\n";

                    } else {
                        input1.value += today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                            result.orderid + "	" + result.account + "	" + result.cusname + "	" + result.tel + "	" + result.prd[i] + "	" + result.prdn[i] + "		" + result.prdcount[i] + "	" + Number(result.prdprice[i]) / Number(result.prdcount[i]).toString() + "	" + result.prdprice[i] + "\n";
                    }

                }
            }
            if(result.prdn.length == 0){
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
