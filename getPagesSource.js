// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    //傳回物件
    var htmlfound = {
        cusname: "",
        prd: []
    };
             

    try {
        //找顧客名稱
        var searchcus = document_root.querySelectorAll(".cusname");
        htmlfound.cusname = searchcus[0].textContent;
        
        
        
        
        
        //找商品ISO
        var search = document_root.querySelectorAll(".iso");
        for (i = 0; i < search.length; i++) {
            htmlfound.prd.push(search[i].innerHTML)
        }
        if (search.length == 0){//沒有找到ISO簡碼
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
