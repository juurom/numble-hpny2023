import List from "../views/List.js";
import Edit from "../views/Edit.js";
import Show from "../views/Show.js";
import NotFound from "../views/NotFound.js";

/*router*/
const navigateTo = url =>{
    history.pushState(null, null, url);
    router();
};

const router = async()=>{
    const routes=[
        {path: /^\/$/, view: List},
        {path: /^\/edit\/?[0-9]*$/, view: Edit},
        {path: /^\/show\/[0-9]+$/, view: Show},
    ];

    
    let locateTo = "/";
    let lastidx = location.pathname.lastIndexOf("/");
    let postId = location.pathname.slice(lastidx+1, location.pathname.length);
    if (!Number.isNaN(postId)) {
        console.log("postId is number:",postId);
        let postIdFor = location.pathname.slice(0, lastidx);
        lastidx = postIdFor.lastIndexOf("/");
        postIdFor = postIdFor.slice(lastidx, postIdFor.length);
        console.log("postIdFor:",postIdFor);
        locateTo = postIdFor + "/"+ postId;
        console.log("case 1 locateTo:",locateTo)
    }
    else{
        locateTo = "/" + postId;
        console.log("case 2 locateTo:",locateTo)
    }

    const potentialMatches = routes.map(route=>{
        return {
            route: route,
            isMatch: route.path.test(locateTo)
        }
    });

    let match = potentialMatches.find(potentialMatch => 
        potentialMatch.isMatch);

    console.log("match:", match);
    if(!match){
        match = {
            route: {path: "404-not-found", view: NotFound},
            isMatch: true,
        };
    };

    const view = new match.route.view();
    document.querySelector("#App").innerHTML = await view.getHtml();
};


/*events*/

window.addEventListener("popstate",router);

const edit = new Edit();
const show = new Show();

document.addEventListener("DOMContentLoaded",()=>{
    router();

    document.body.addEventListener("click", async(e)=>{
        //if edit page
        //editPost() occurs first
        if (e.target.id==="EditAddBtn") {
            if (edit.getPostId()) await edit.editPost();
            else await edit.addPost();
        }
        if (e.target.id==="EditImageChange") {
            edit.getImage("clicked");
        }

        //if show page
        //executeDelete() occurs first||
        if (e.target.id==="ShowDeleteBtn") show.alertDelete(null);
        else if (e.target.id==="ShowCommentDeleteBtn") show.deleteComment(e.target.getAttribute("data-key"));
        else if (e.target.id==="ShowAlertDeleteBtn") await show.executeDelete();
        else if (e.target.id==="ShowAlertCancleBtn") show.cancleDelete();
        else if (e.target.id==="ShowWriteBtn") show.addComment();
               
        //and then route
        if (e.target.matches("[data-link]")){
            navigateTo(e.target.dataset.link);
        }
    });
})
