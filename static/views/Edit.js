import AbstractView from "./AbstractView.js";

const UNSPLASH_URL = "https://api.unsplash.com/photos/random?client_id=eqYyvjr-ziiTM28CnPklAKC2OGO9z-vYnzOycwr5VaE"
const BASE_URL = "api";
let POSTID = null;
let IMAGEURL = "";
let title = "";
let content = "";

export default class Edit extends AbstractView{
    constructor(){
        super();
        this.setTitle("HPNY 2023 - New Post");
        title = "";
        content = "";
        POSTID = this.getPostId();
        if (POSTID) this.setBackLink(`/show/${POSTID}`);
        else this.setBackLink("/");
    }

    async getImage(clicked){
        const res = await fetch(UNSPLASH_URL);
        const data = await res.json();
        const pic = data.urls.raw;
        IMAGEURL = pic;
        if (clicked){
            const imgdiv = document.getElementById("EditImage");
            imgdiv.innerHTML=`<img id="EditImageChange" src=${IMAGEURL}></img>`
        }
    }

    async getPost(){
        const res = await fetch(BASE_URL+"/post/"+POSTID);
        const data = await res.json();
        const postdata = data.data;
        IMAGEURL = postdata.post.image;
        title = postdata.post.title;
        content = postdata.post.content;
    }


    async editPost(){
        const editTitle = document.getElementById("EditTitle").getElementsByTagName("input")[0].value;
        const editContent = document.getElementById("EditContent").getElementsByTagName("textarea")[0].value;
       
        const res = await fetch(BASE_URL+"/post/"+POSTID, {
            method: 'PATCH',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": editTitle,
                "content": editContent,
            }),
        })
        const data = await res.json();
    }


    async addPost(){
        const title = document.getElementById("EditTitle").getElementsByTagName("input")[0].value;
        const content = document.getElementById("EditContent").getElementsByTagName("textarea")[0].value;
        const image = document.getElementById("EditImage").getElementsByTagName("img")[0].src;        
        const res = await fetch(BASE_URL+"/post", {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": title,
                "content": content,
                "image": image,
            }),
        })
        const data = await res.json();
    }

    async getHtml(){
        if (POSTID) {
            await this.getPost();
        }
        else{
            await this.getImage();
        }

        return `
        <div id="Edit">
            <div id="EditImage">
            <img id="EditImageChange" src=${IMAGEURL}></img>
            </div>
            <div id="EditTitle">
                <input type="text" placeholder="??????" value="${title}"></input>
            </div>
            <div id="EditContent">
                <textarea placeholder="????????? ???????????????...">${content}</textarea>
            </div>
            <button id="EditAddBtn" data-link="/">????????????</button>
        </div>
        `;
        
    }

}

