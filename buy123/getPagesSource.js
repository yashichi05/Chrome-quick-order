// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    //傳回物件
    var htmlfound = [];


    try {
        var f_orderdown //檔次*
        var f_orderid //訂單ID*
        var f_cusname //客人姓名*
        var f_prdcounttype //方案 * 組數*
        var f_prdtype //商品款式---
        var f_prd //商品*
        var f_prdcount //商品實際數量
        var f_ship //超商*
        var ship_code //非超商要-1
        var sp_prd //分割
        f_prdtype = '' //商品選項 暫時空的----
        f_ship = document_root.querySelectorAll("h1")[0].textContent[0];

        section_main = document_root.querySelectorAll("section")[1].querySelectorAll("td"); //第一個表格td
        //判斷貨運
        if (f_ship == "7") {
            f_ship = "7-11"
            ship_code = 0
        } else if (f_ship == "全") {
            f_ship = "全家"
            ship_code = 0
        } else {
            f_ship = "大榮"
            ship_code = -1
        }
        for (i = 0; i < section_main.length / 10 - 1; i++) {
            f_orderdown = document_root.querySelectorAll("section")[0].querySelectorAll("li")[0].textContent.substring(5);
            if (ship_code == 0 && i > 0) {
                ship_code = -1
            }
            f_orderid = section_main[i * 10 + 2 + ship_code].textContent;
            f_cusname = section_main[i * 10 + 3 + ship_code].textContent;
            f_prdcounttype = section_main[i * 10 + 6 + ship_code].textContent;
            f_prd = section_main[i * 10 + 7 + ship_code].textContent;
            f_prd = f_prd.replace(/\n/g, "").replace(/	/g, "") //去除換行
            f_prdcount = f_prd.split("*")[1]
            sp_prd = f_prd.split(/\* [0-9]/)
            htmlfound.push({
                orderdown: f_orderdown,
                orderid: f_orderid,
                cusname: f_cusname,
                prdcounttype: f_prdcounttype,
                prdtype: f_prdtype,
                prd: f_prd,
                prdcount: f_prdcount,
                ship: f_ship,
                sped_prd : sp_prd
            })
            
            //console.log(f_prd)
            //console.log(f_cusname, f_prdcounttype, f_prdtype, f_prd, f_prdcount, f_ship,sp_prd)
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
