// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);


function DOMtoString(document_root) {
    //傳回物件
    var htmlfound = {
        cusname: "",
        orderid: "",
        tel: "",
        ship: "新竹",
        prdprice: "",
        allprice: "",
        discount: "",
        fee: "0",
        receipt: "",
        option: "",
        prdname:"",
        prdurl:"",
        prd: [],
    };


    try {

        //找顧客名稱


        var orderinfo_r = document_root.querySelectorAll(".card-box")[0].querySelectorAll("th")
        var prdinfo_r = document_root.querySelectorAll(".card-box")[1].querySelectorAll(".table")[0].querySelectorAll("th")

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "收件人") {

                htmlfound.cusname = orderinfo_r[i].nextElementSibling.textContent;
            }

        }

        for (var i = 0; i < orderinfo_r.length; i++) {

            if (orderinfo_r[i].textContent == "聯絡電話") {
                htmlfound.tel = "'"+orderinfo_r[i].nextElementSibling.textContent;
            }

        }
        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "訂單編號") {
                htmlfound.orderid = orderinfo_r[i].nextElementSibling.textContent.replace("#", "").split(" ")[0];
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "取貨門市") {
                htmlfound.ship = orderinfo_r[i].nextElementSibling.textContent.split("-")[0];
                if (htmlfound.ship == "7"){
                   htmlfound.ship = "'7-11" 
                }
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "折扣金額") {
                htmlfound.discount = orderinfo_r[i].nextElementSibling.textContent.split("$")[1].split(" ")[0].replace("\n", "");
                htmlfound.discount = -1*Number(htmlfound.discount)
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "超商付款手續費") {
                htmlfound.fee = orderinfo_r[i].nextElementSibling.textContent.split("$")[1].split(" ")[0].replace("\n", "");
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "訂單金額") {
                htmlfound.allprice = orderinfo_r[i].nextElementSibling.textContent.replace("$", "").split(" ")[0];
            }
        }
        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "發票") {
                htmlfound.receipt = orderinfo_r[i].nextElementSibling.textContent.split("發票")[0].slice(-2);
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "商品價格") {
                htmlfound.prdprice = orderinfo_r[i].nextElementSibling.textContent.split("=")[1].replace(" $", "");
            }
        }


        for (var i = 0; i < prdinfo_r.length; i++) {
            if (prdinfo_r[i].textContent == "方案") {
                htmlfound.option = prdinfo_r[i].nextElementSibling.textContent.split("*")[0].replace(" ", "");
            }
        }
        for (var i = 0; i < prdinfo_r.length; i++) {
            if (prdinfo_r[i].textContent == "選項") {
                for (var ii = i; ii < prdinfo_r.length; ii++) {
                    htmlfound.prd.push(prdinfo_r[ii].nextElementSibling.textContent)
                }
            }
        }
        //商品ID、名稱
        htmlfound.prdurl = document_root.querySelectorAll(".card-box")[1].querySelectorAll("a")[0].getAttribute("href").split("/")
        htmlfound.prdurl = htmlfound.prdurl[htmlfound.prdurl.length-2]//split 的陣列 倒數第二個
        htmlfound.prdname = document_root.querySelectorAll(".card-box")[1].querySelectorAll("a")[0].textContent
        console.log(htmlfound)






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
