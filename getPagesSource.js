// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    //傳回物件
    var htmlfound = {
        cusname: "",
        orderid: "",
        tel: "",
        account: "",
        ship: "",
        shipprice: "",
        allprice: "",
        prd: [],
        prdcount: [],
        prdprice: [],
        prdn: [] //錯誤時顯示的商品名稱
    };


    try {
        var search = document_root.querySelectorAll(".detail-name-omd");
        var search_c = document.querySelectorAll(".detail-number");
        var search_p = document.querySelectorAll(".detail-price");
        //找顧客名稱
        htmlfound.cusname = document_root.querySelectorAll(".pair-value")[19].textContent;
        htmlfound.orderid = document_root.querySelectorAll(".pair-value")[1].textContent;
        htmlfound.tel = document_root.querySelectorAll(".pair-value")[21].textContent;
        htmlfound.account = document.querySelectorAll(".pair-value")[2].textContent.split(" ")[2];
        htmlfound.ship = document_root.querySelectorAll(".pair-value")[18].textContent;
        if (htmlfound.ship.slice(0, 1) == "全") {
            htmlfound.ship = "全家"
        } else if (htmlfound.ship.slice(0, 1) == "7") {
            htmlfound.ship = "7-11"
        } else {
            htmlfound.ship = "宅配"
        }
        htmlfound.shipprice = document_root.querySelectorAll(".number")[search_c.length + 3].textContent;
        htmlfound.allprice = document_root.querySelectorAll(".number")[0].textContent.replace(",", "");





        //找商品ISO
        for (i = 0; i < search_c.length - 1; i++) {
            try {
                htmlfound.prdn.push(document_root.querySelectorAll(".item")[i].textContent)
                try { //iso 
                    htmlfound.prd.push(search[i + 1].querySelectorAll(".t-sub-note")[0].textContent.split(":", 2)[1].slice(1));
                } 
                catch (e) { //找不到iso簡碼 錯誤
                    htmlfound.prd.push("")
                }
                htmlfound.prdcount.push(search_c[i + 1].textContent);
                htmlfound.prdprice.push(search_p[i + 1].textContent.slice(2).replace(",", ""));
            } catch (e) {
                console.log('nopeiso')
            }
        }



    } catch (e) {


        console.log('獲取訂單資料失敗')
    }

    return htmlfound;
}
//送出執行給監聽
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
