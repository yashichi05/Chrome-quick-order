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
        shiPrice: "",
        allprice: "",
        prd: []
    };


    try {
        //找顧客名稱
        htmlfound.cusname = document_root.querySelectorAll(".pair-value")[19].textContent;
        htmlfound.orderid = document_root.querySelectorAll(".pair-value")[1].textContent;
        htmlfound.tel = document_root.querySelectorAll(".pair-value")[21].textContent;
        htmlfound.account = document.querySelectorAll(".pair-value")[2].textContent.split(" ")[2];
        htmlfound.ship = document_root.querySelectorAll(".pair-value")[18].textContent;
        htmlfound.shiPrice = document_root.querySelectorAll(".number")[5].textContent;
        htmlfound.allprice = document_root.querySelectorAll(".number")[0].textContent;
        




        //找商品ISO
        var search = document_root.querySelectorAll(".t-sub-note");

        for (i = 0; i < search.length; i++) {
            try {
                htmlfound.prd.push(search[i].textContent.split(":", 2)[1].slice(1))
                console.log(search[i].textContent.split(":", 2)[1].slice(1))
            } catch (e) {
                console.log('nopeiso')
            }
        }

        if (search.length == 0) { //沒有找到ISO簡碼
            htmlfound.prd.push("找不到資料")
        }

    } catch (e) {


        htmlfound.prd.push("找不到資料")
    }

    return htmlfound;
}
//送出執行給監聽
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
