import AbstractView from "./AbstractView.js";

const BASE_URL = "api";
let POSTID = null;

export default class Show extends AbstractView{
    
    constructor(){
        super();
        this.setTitle("HPNY 2023 - Post");
        this.setBackLink("/");
        POSTID = this.getPostId();
    }

    alertDelete(){
        const AlertMessage = document.getElementById("ShowAlert");
        AlertMessage.style.display="block";
    }

    cancleDelete(){
        const AlertMessage = document.getElementById("ShowAlert");
        AlertMessage.style.display="none";
    }

    async executeDelete(){
        const AlertMessage = document.getElementById("ShowAlert");
        await this.deletePost();
        AlertMessage.style.display="none";
    }

    async getPost(){
        console.log("getpost (in list.js)")
        console.log("fetchto:",BASE_URL+"/post/"+POSTID);        
        const res = await fetch(BASE_URL+"/post/"+POSTID, { credentials: true });
        console.log(res);    
        const data = await res.json();
        const postdata = data.data;
        return postdata;
    }

    async deletePost(){
        const res = await fetch(BASE_URL+"/post/"+POSTID, {
            method: 'DELETE',
        })
        const data = await res.json();
    }

    async addComment(){
        const content = document.getElementById("ShowWrite").getElementsByTagName("input")[0].value;
        const res = await fetch(BASE_URL+"/comment/"+POSTID, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "content": content,
            }),
        })
        const data = await res.json();
        
        const newcomment = document.createElement("div");
        newcomment.setAttribute("id", "ShowComment");
        newcomment.innerHTML = 
        `
        <div id="ShowCommentItem">
            ${data.data.content}
        </div>
        <button id="ShowCommentDeleteBtn" data-key=${data.data.commentId} data-link="/show/${POSTID}">X</button>
        `
        const wrapper = document.getElementById("ShowCommentWrapper");
        wrapper.appendChild(newcomment);

        const blank = document.getElementById("ShowWriteContent");
        blank.value=null;
    }

    async deleteComment(COMMENTID){
        const res = await fetch(BASE_URL+"/comment/"+COMMENTID, {
            method: 'DELETE',
        })
        const data = await res.json();

        const remove = document.querySelector(`[data-key="${COMMENTID}"]`);
        remove.parentNode.style.display="none";
    }

    async getHtml(){
        console.log("gethtml(in show.js)")
        const postdata = await this.getPost();
        const post = postdata.post;
        const comments = postdata.comments;

        return `
        <div id="Show">
            <div id="ShowImage">
                <image src=${post.image}></image>
            </div>
            <div id="ShowTitle">${post.title}</div>
            <div id="ShowContent">
                <p>작성: ${post.createdAt.substr(0, 10)} ${post.createdAt.substr(11,5)} | 수정: ${post.updatedAt.substr(0,10)} ${post.updatedAt.substr(11,5)}<br/><br/>
                </p>
                ${post.content}</div>
            <div id="ShowBtns">
                <button id="ShowEditBtn" data-link="/edit/${POSTID}">
                    <image id="ShowEditBtn" src="https://cdn-icons-png.flaticon.com/512/2213/2213475.png" data-link="/edit/${POSTID}"></image>
                </button>
                <button id="ShowDeleteBtn">
                    <image id="ShowDeleteBtn" src="https://cdn-icons-png.flaticon.com/512/1345/1345874.png"></image>
                </button>
            </div>
            <hr/>

            <div id="ShowCommentWrapper">
            ${comments.map((elm)=>(
                `<div id="ShowComment">
                <div id="ShowCommentItem">
                    ${elm.content}
                </div>
                <button id="ShowCommentDeleteBtn" data-key=${elm.commentId}>X</button>
                </div>`
            )).join('')}
            </div>


            <div id="ShowWrite">
                <input id="ShowWriteContent" type="text"/>
                <button id="ShowWriteBtn">&lt;</button>
            </div>
            
            <div id="ShowAlert">
                <div id="ShowAlertMessage">
                정말 삭제하시겠습니까?<br/>
                <button id="ShowAlertDeleteBtn" data-link ="/">삭제</button>
                <button id="ShowAlertCancleBtn">취소</button>
                </div>
            </div>

        </div>
        `;
    }

}

