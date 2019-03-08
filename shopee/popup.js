//新增監聽?

chrome.runtime.onMessage.addListener(function (request, sender) {



    if (request.action == "getSource") {
        //讀取已存的ISO商品明細
        chrome.storage.local.get("sp_value", function (items) {
            document.getElementById('isolist').value = items.sp_value

            result = request.source
            //轉ISO資料為html
            var parser = new DOMParser();
            isohtml = parser.parseFromString(items.sp_value, "text/html");



            //搜尋ISO
            var trlist = isohtml.querySelectorAll("tr"); //G表商品列
            var row = -1

            for (i = 0; i < result.prd.length; i++) { //查ISO資料
                var target_iso = result.prd[i].prdiso[result.prd[i].prdiso.length - 1].replace(" ", "").replace(" ", "") //兩種空白字元
                for (ii = 0; ii < trlist.length; ii++) {
                    //macth 搜尋字串是否含有特定文字
                    if (trlist[ii].querySelectorAll("td")[0].innerHTML.match(target_iso)) {
                        console.log(target_iso, trlist[ii].querySelectorAll("td")[0].innerHTML)

                        row = ii;
                        result.prd[i].true_iso = trlist[row].querySelectorAll("td")[0].textContent;
                        result.prd[i].true_name = trlist[row].querySelectorAll("td")[1].textContent;
                        result.prd[i].true_type = trlist[row].querySelectorAll("td")[2].textContent;
                        break;
                    }

                }
            }

            //打訂單
            var today = new Date()



            //輸出顯示
            for (i = 0; i < result.prd.length; i++) {
                if (i == 0){//第一行
                    input1.value +=  today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                            result.orderid + "	" + result.cusname + "	" + result.tel + "	" + result.account + "	" +result.prd[i].true_iso+ "	" +result.prd[i].true_name+"	" +result.prd[i].true_type+"	" +result.prd[i].prdcount+"	" +result.prd[i].prdprice+"	" +Number(result.prd[i].prdprice)*Number(result.prd[i].prdcount)+ "	" + result.ship+ "	" + result.shipprice +"	"+ (Number(result.allprice)+Number(result.shipprice)+Number(result.discount))+"	" +"	" +"	" +result.fee+"\n"
                    
                    
                }
                else{
                     input1.value +=  today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                            result.orderid + "	" + result.cusname + "	" + result.tel + "	" + result.account + "	" +result.prd[i].true_iso+ "	" +result.prd[i].true_name+"	" +result.prd[i].true_type+"	" +result.prd[i].prdcount+"	" +result.prd[i].prdprice+"	" +Number(result.prd[i].prdprice)*Number(result.prd[i].prdcount) +"\n"
                }
                
                
            } 
            if (result.discount != "0"){
                input1.value +=  today.getFullYear().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getDate().toString() + "	" +
                            result.orderid + "	" + result.cusname + "	" + result.tel + "	" + result.account + "	" + "	" +"折扣券"+"	" +"	" +"1"+"	" +result.discount+"	" +Number(result.discount) +"\n"
                
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
        xhr.open("GET", "https://docs.google.com/spreadsheets/d/19ZXwhENPrLmLURoKO4xXoCDahpyMG5wuU_8xsU74kyI/gviz/tq?tqx=out:html&tq=select%20B,C,D&gid=0", false);
        xhr.send();
        document.getElementById('isolist').value = xhr.responseText;
        document.querySelector('button').innerHTML = "OK";


        //存入更新資料
        var theValue = document.getElementById('isolist').value;

        chrome.storage.local.set({
            'sp_value': theValue
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
