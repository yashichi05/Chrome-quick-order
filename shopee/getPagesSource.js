// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);


function DOMtoString(document_root) {
    //傳回物件
    var htmlfound = {
        cusname: "",
        orderid: "",
        tel: "",
        ship: "新竹",
        shipprice: "",
        account: "",
        allprice: "",
        discount: "0",
        fee: "",
        prd: [],
    };


    try {

        //找顧客名稱


        var orderinfo_r = document_root.querySelectorAll(".header")
        var priceinfo_r = document_root.querySelectorAll(".income-label")
        var prdinfo = document_root.querySelectorAll(".product-name")
        var prd_price = document_root.querySelectorAll(".price")

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "買家收件地址") {

                htmlfound.cusname = orderinfo_r[i].nextElementSibling.textContent.split(",")[0];
            }

        }
        for (var i = 0; i < orderinfo_r.length; i++) {

            htmlfound.account = document_root.querySelectorAll(".user-view-item__username")[0].textContent

        }

        for (var i = 0; i < orderinfo_r.length; i++) {

            if (orderinfo_r[i].textContent == "買家收件地址") {
                htmlfound.tel = "'0" + orderinfo_r[i].nextElementSibling.textContent.split("886")[1].substring(0, 9);
            }

        }
        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "訂單編號") {
                htmlfound.orderid = orderinfo_r[i].nextElementSibling.textContent;
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "運送資訊") {
                htmlfound.ship = orderinfo_r[i].nextElementSibling.textContent.split("#")[0];
                if (htmlfound.ship == "7-11") {
                    htmlfound.ship = "'7-11"
                }
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) { //???
            if (orderinfo_r[i].textContent == "折扣金額") {
                htmlfound.discount = orderinfo_r[i].nextElementSibling.textContent.split("$")[1].split(" ")[0].replace("\n", "");
                htmlfound.discount = -1 * Number(htmlfound.discount)
            }
        }

        for (var i = 0; i < orderinfo_r.length; i++) {
            if (orderinfo_r[i].textContent == "信用卡後四碼") {
                htmlfound.fee = "信用卡";
            }
        }

        for (var i = 0; i < priceinfo_r.length; i++) {
            if (priceinfo_r[i].textContent == "訂單金額") {
                htmlfound.allprice = priceinfo_r[i].nextElementSibling.textContent.replace("$", "");
            }
        }
        for (var i = 0; i < priceinfo_r.length; i++) {
            if (priceinfo_r[i].textContent == "運費總支付") {
                htmlfound.shipprice = priceinfo_r[i].nextElementSibling.textContent.replace("$", "");
            }
        }
        for (var i = 0; i < priceinfo_r.length; i++) {
            if (priceinfo_r[i].textContent.match("折扣券")) {
                    htmlfound.discount = priceinfo_r[i].nextElementSibling.textContent.replace("$", "");
                }
            }








            for (var i = 0; i < prdinfo.length; i++) {
                htmlfound.prd.push({
                    'prdname': prdinfo[i].textContent,
                    'prdiso': prdinfo[i].nextElementSibling.textContent.split("商品選項貨號: "),
                    'prdprice': prd_price[i + 1].textContent,
                    'prdcount': prd_price[i + 1].nextElementSibling.textContent,
                    'true_iso': "",
                    'true_name': "",
                    'true_type': ""
                })



            }
            //商品ID、名稱
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
