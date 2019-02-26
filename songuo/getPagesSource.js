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
        prdprice: "",
        allprice: "",
        discount: "",
        fee: "0",
        receipt: "",
        prd: [],
    };


    try {

        //找顧客名稱


        var orderinfo_r = document_root.querySelectorAll(".card-box")[0].querySelectorAll("th")
        var prdinfo_r = document_root.querySelectorAll(".card-box")[1].querySelectorAll("th")
        
        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "收件人") {
                
                htmlfound.cusname = cusname_s[i].nextElementSibling.textContent;
            }
            
        }
        
        for (var i = 0; i < orderinfo_r.length; i++) {
            
            if (orderinfo_r[i].textContent == "聯絡電話") {
                htmlfound.tel = cusname_s[i].nextElementSibling.textContent;
            }
            
        }
        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "訂單編號") {
                htmlfound.orderid = cusname_s[i].nextElementSibling.textContent.replace("#", "");
            }
        }
        
        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "取貨門市") {
                htmlfound.orderid = cusname_s[i].nextElementSibling.textContent;
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "折扣金額") {
                htmlfound.discount = cusname_s[i].nextElementSibling.textContent.replace("$", "");
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "超商付款手續費") {
                htmlfound.fee = cusname_s[i].nextElementSibling.textContent.replace("$", "");
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "訂單金額") {
                htmlfound.allprice = cusname_s[i].nextElementSibling.textContent.replace("$", "");
            }
        }
        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "發票") {
                htmlfound.allprice = cusname_s[i].nextElementSibling.textContent;
            }
        }
        
        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "商品價格") {
                htmlfound.prdprice = cusname_s[i].nextElementSibling.textContent.split("=")[1].replace(" $", "");
            }
        }


        for (var i = 0; i < prdinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "方案") {
                htmlfound.prdprice = cusname_s[i].nextElementSibling.textContent.split("*")[0];
            }
        }
        for (var i = 0; i < prdinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "選項") {
                htmlfound.prdprice = cusname_s[i].nextElementSibling.textContent;
            }
        }
        






        //商品是否有選項



    } catch (e) {

        console.log("htmlfound2 ")


    }

    return htmlfound;
}
//送出執行給監聽
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
