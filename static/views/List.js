import AbstractView from "./AbstractView.js";

const BASE_URL = "api";

export default class List extends AbstractView{
    constructor(){
        super();
        this.setTitle("HPNY 2023");
        this.setBackLink();
    }

    async getList(){
        const res = await fetch(BASE_URL+"/posts" );
        const data = await res.json();
        const list = data.data.posts;
        
        list.sort((a,b)=>{
            if (a.postId > b.postId) return -1;
            if (a.postId < b.postId) return 1;
            return 0;
        })
        return list;
    }

    async getHtml(){
        const list = await this.getList();
        return (
        `<div id="List">
            <button id="ListAddBtn" data-link="/edit">새 글 작성하기</button>
            ${list.map((elm, key)=>(
                  `<div id="ListItem" data-link="/show/${elm.postId}">
                    <div id="ListItemImage" data-link="/show/${elm.postId}">
                        <image src=${elm.image} loading=${key>3?"lazy":"eager"}></image>
                    </div>
                    <div id="ListItemTitle" data-link="/show/${elm.postId}">${elm.title}</div>
                    <div id="ListItemContent" data-link="/show/${elm.postId}">${elm.content}</div>
                </div>`
            )).join('')}
        </div>`
        );
    }

}