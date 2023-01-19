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
        const numcheck = /^\d+$/;
        if (numcheck.test(locateTo)) return locateTo;
    }

    async getHtml(){
       return ""; 
    }
}