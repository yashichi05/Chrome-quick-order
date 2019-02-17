//新增監聽?
chrome.runtime.onMessage.addListener(function (request, sender) {

    if (request.action == "getSource") {
        //讀取已存的ISO商品明細
        chrome.storage.sync.get("value", function (items) {
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


                //寫入訂單資料
                if (found == 1) {
                    console.log(trlist[row].textContent.slice(1))
                    //輸出顯示
                    input1.value += result.cusname + "	" + trlist[row].querySelector("td").textContent + "	" + trlist[row].querySelectorAll("td")[1].textContent + "	" + trlist[row].querySelectorAll("td")[2].textContent + "\n";
                } else {
                    input1.value = result.prd[i];

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
        xhr.open("GET", "https://docs.google.com/spreadsheets/d/1o14isxIEJIzNOraSgDbR0eGZqzRFSKpncFZM1C7cTCA/gviz/tq?tqx=out:html&tq=select%20B,C,D&gid=0", false);
        xhr.send();
        document.getElementById('isolist').value = xhr.responseText;
        document.querySelector('button').innerHTML = "OK";



        //存入更新資料
        var theValue = document.getElementById('isolist').value;
        chrome.storage.sync.set({
            'value': theValue
        }, function () {});

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
