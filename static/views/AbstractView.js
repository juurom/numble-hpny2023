export default class AbstractView{
    constructor(){

    }
    setTitle(title){
        document.title=title;
    }

    setBackLink(newlink){
        const backBtn = document.getElementById("HeaderBackBtn")
        if (newlink) {
            backBtn.style.visibility="";
            backBtn.dataset.link=newlink;
        }
        else{
            backBtn.style.visibility="hidden";
        }
    }

    getPostId(){
        const lastidx = location.pathname.lastIndexOf("/");
        const locateTo = location.pathname.slice(lastidx+1, location.pathname.length);
        console.log("locateTo(edit.js):", locateTo);
        if (!isNaN(locateTo)) return locateTo;
    }

    async getHtml(){
       return ""; 
    }
}