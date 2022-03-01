<template>
  <div class="details">
      <div class="info">
          <div class="options" v-if="mutable">
              <div class="edit" @click="toggleShowModal">
                  <router-link :to="{name: 'UpdateBlog'}">
                      <i class="bi bi-pencil-fill"></i>
                  </router-link>
              </div>
              <div class="delete" @click="deleteThisBlog">
                  <i class="bi bi-trash-fill"></i>
              </div>
        </div>
          <h1 class="title">{{blog.title}}</h1>
          <p class="author">{{blog.author}}</p>
          <small class="date">Posted on: <span>{{blog.date_posted}}</span></small>
          <div class="break"></div>
          <div class="opinion" v-if="showOpinion">
              <div class="like" @click="likeThisBlog">
                  <i class="bi bi-hand-thumbs-up-fill" v-if="liked"></i>
                  <i class="bi bi-hand-thumbs-up" v-else></i>
              </div>
              <div class="dislike" @click="dislikeThisBlog">
                  <i class="bi bi-hand-thumbs-down-fill" v-if="disliked"></i>
                  <i class="bi bi-hand-thumbs-down" v-else></i>
              </div>
              <div class="follow" @click="followThisUser">
                  <button v-if="isFollowing" class="unfollow">Unfollow</button>
                  <button v-else>Follow</button>
              </div>
          </div>
      </div>
      <div class="blog-content">
          <p>
             {{blog.content}}
          </p>
      </div>
      <div class="comment">
          <h2>Comments: </h2>
          <div class="comment-box" v-for="comment in comments" :key="comment._id">
            <div class="delete" @click="() => deleteThisComment(comment._id)">
              <i class="bi bi-trash-fill"></i>
            </div>
            <small>{{ comment.commented_on }}</small>
            <p>{{ comment.commenterUsername }}</p>
            <p>{{ comment.comment }}</p>
          </div>
          <div class="form-control">
              <textarea placeholder="Type your comment..." v-model="comment"></textarea>
          </div>
          <div class="form-control">
              <input type="button" value="Comment" @click="commentOnBlog">
          </div>
      </div>
      <div class="detail-modal" v-if="showModal" @click.self="toggleShowModal">
          <router-view/>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { useFetch } from '../composables/useFetch.js';
import { endpoints } from '../assets/endpoints.js';
import { useRouter } from 'vue-router';
export default {
    name: 'Details',
    props: ['id'],
    setup(props){
        const comment = ref('');
        const comments = ref([]);
        const store = useStore();
        const router = useRouter();
        const blog = ref({});
        const theme = computed(() => store.state.theme);
        const currentUser = computed(() => store.state.currentUser);
        let showModal = ref(false);
        const liked = ref(false);
        const disliked = ref(false);
        const isFollowing = ref(false);
        const mutable = ref(false);
        const showOpinion = ref(false);
        const toggleShowModal = (e) => {
            showModal.value = !showModal.value;
            if(e.target.className === 'detail-modal'){
                router.go(-1);
            }
        };
        useFetch(
            endpoints.getBlog.path,
            endpoints.getBlog.method,
            null,
            currentUser.value.token,
            props.id

        )
        .then(res => {
            let i = res.date_posted.indexOf('T');
            res.date_posted = res.date_posted.slice(0, i);
            comments.value = res.comments;
            blog.value = res;
            const haveLiked = res.likes.some(item => item.email === currentUser.value.email);
            const haveDisliked = res.dislikes.some(item => item.email === currentUser.value.email);
            const haveFollowed = res.owner.followers.some(item => item === currentUser.value.id);
            if(haveLiked){
                liked.value = true;
            }
            if(haveDisliked){
                disliked.value = true;
            }
            if(haveFollowed){
                isFollowing.value = true;
            }
            if(res.owner._id === currentUser.value.id){
                mutable.value = true; 
            }else{
                showOpinion.value = !showOpinion.value
            }
            store.commit('updateBlogDetail', res);
        })
        .catch(err => console.log(err));
        const deleteThisBlog = () => {
            useFetch(
                endpoints.deleteBlog.path,
                endpoints.deleteBlog.method,
                null,
                currentUser.value.token,
                props.id
            )
            .then(res => {
                console.log(res);
                router.push({name: 'Home'});
            })
            .catch(err => console.log(err));
        }
        const likeThisBlog = () => {
            const body = {
                likedBy: currentUser.value.username,
                email: currentUser.value.email
            };
            useFetch(
                endpoints.likeBlog.path,
                endpoints.likeBlog.method,
                body,
                currentUser.value.token,
                props.id
            )
            .then(res => {
                console.log(res);
                liked.value = !liked.value;
                if(disliked.value){
                    disliked.value = !disliked.value;
                }
            })
            .catch(err => console.log(err));
        } 
        const dislikeThisBlog = () => {
            const body = {
                dislikedBy: currentUser.value.username,
                email: currentUser.value.email
            };
            useFetch(
                endpoints.dislikeBlog.path,
                endpoints.dislikeBlog.method,
                body,
                currentUser.value.token,
                props.id
            )
            .then(res => {
                console.log(res);
                disliked.value = !disliked.value;
                if(liked.value){
                    liked.value = !liked.value;
                }
            })
            .catch(err => console.log(err));
        } 
        const followThisUser = () => {
            const body = {
                id: currentUser.value.id
            }
            useFetch(
                endpoints.followUser.path,
                endpoints.followUser.method,
                body,
                currentUser.value.token,
                blog.value.owner._id
            )
            .then(res => {
                console.log(res);
                isFollowing.value = !isFollowing.value;
            })
            .catch(err => console.log(err));
        }
        const commentOnBlog = () => {
            const body = {
                email: currentUser.value.email,
                username: currentUser.value.username,
                comment: comment.value,
                commentedTo: props.id
            }
            useFetch(
                endpoints.commentBlog.path,
                endpoints.commentBlog.method,
                body,
                currentUser.value.token
            )
            .then(res => {
                comments.value = res;
            })
            .catch(err => console.log(err));
        }
        const deleteThisComment = id => {
            useFetch(
                endpoints.deleteComment.path,
                endpoints.deleteComment.method,
                null,
                currentUser.value.token,
                id
            )
            .then(res => {
                console.log(res);
                comments.value = comments.value.filter(item => item._id !== id);
            })
        }
        return{
            theme, 
            blog, 
            toggleShowModal, 
            showModal, 
            deleteThisBlog,
            liked,
            disliked,
            likeThisBlog,
            dislikeThisBlog,
            followThisUser,
            isFollowing,
            mutable,
            showOpinion,
            comment,
            commentOnBlog,
            comments,
            deleteThisComment
        }
    }
}
</script>

<style>
    .details{
        width: 65%;
        margin: 30px auto 0 auto;
        padding: 25px;
        display: grid;
        gap: 10px;
    }
    .details .comment,
    .details .comment .form-control{
        width: 100%;
        color: v-bind('theme.textColor');
        margin: 10px 0;
    }
    .details .comment .form-control textarea{
        resize: none;
        width: 100%;
        height: 7rem;
        border: none;
        background: v-bind('theme.background');
        font-family: cursive;
        outline: none;
        padding: 5px;
        color: v-bind('theme.textColor');
    }
    .details .comment .form-control input{
        width: 100%;
        padding: 7px;
        font-size: 1.1rem;
        letter-spacing: 1px;
        border: none;
        background: rgb(64, 245, 64);
        color: v-bind('theme.textColor');
        font-family: cursive;
        font-weight: bold;
        cursor: pointer;
    }
    .details .comment .comment-box{
        position: relative;
        width: 100%;
        background: v-bind('theme.background');
        color: v-bind('theme.textColor');
        padding: 7px;
        margin: 10px 0;
        border-radius: 10px;
    }
    .details .comment .comment-box > *{
        margin: 10px 0;
    }
    .details .comment .comment-box small{
        display: inline-block;
        color: v-bind('theme.textColorGray');
        font-weight: bold;
        margin: 0;
    }
    .details .detail-modal{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: v-bind('theme.modalBackground');
        overflow-y: scroll;
        z-index: 11;
    }
    .details .info{
        position: relative;
        z-index: 0;
    }
    .details .info .break{
        width: 100%;
        height: 1px;
        background: v-bind("theme.body");
        margin: 12px 0;
    }
    .details .info .opinion{
        margin: 10px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 15px;
    }
    .details .info .opinion .like,
    .details .info .opinion .dislike{
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        background: v-bind('theme.body');
        color: v-bind('theme.background');
        border-radius: 50%;
        cursor: pointer;
        transition: transform .2s ease-in-out;
    }
    .details .info .opinion .like .bi-hand-thumbs-up-fill{
        color: rgb(20, 204, 20);
    }
    .details .info .opinion .dislike .bi-hand-thumbs-down-fill{
        color: orangered;
    }
    .details .info .opinion .like:hover{
        transform: scale(1.2);
        color: rgb(20, 204, 20);
    }
    .details .info .opinion .dislike:hover{
        transform: scale(1.2);
        color: orangered;
    }
    .details .info .opinion .follow button{
        border: none;
        padding: 5px 10px;
        background: rgb(20, 204, 20);
        color: v-bind('theme.textColor');
        font-weight: bold;
        border-radius: 5px;
        transition: transform .2s ease-in-out;
        cursor: pointer;
    }
    .details .info .opinion .follow .unfollow{
        background: orangered;
    }
    .details .info .opinion .follow button:hover{
        transform: scale(1.1);
    }
    .details .info .options{
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
    .details .info .options .edit a,
    .details .info .options .delete{
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        background: v-bind('theme.body');
        color: v-bind('theme.background');
        border-radius: 50%;
        cursor: pointer;
        transition: transform .2s ease-in-out;
    }
    .details .comment .comment-box .delete{
        position: absolute;
        top: 0;
        right: 5px;
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        background: v-bind('theme.body');
        color: v-bind('theme.background');
        border-radius: 50%;
        cursor: pointer;
        transition: transform .2s ease-in-out;

    }
    .details .comment .comment-box .delete:hover{
        transform: scale(1.2);
        color: orangered;
    }
    .details .info .options .edit a:hover{
        transform: scale(1.2);
        color: rgb(7, 155, 247);
    }
    .details .info .options .delete:hover{
        transform: scale(1.2);
        color: orangered;
    }
    .details .info,
    .details .blog-content{
        width: 100%;
        padding: 13px;
        border-radius: 10px;
        background: v-bind('theme.background');
        color: v-bind('theme.textColor');
    }
    .details .blog-content{
        font-family: cursive;
        line-height: 1.8;
        word-spacing: 1.2px;
    }
    .details .info .title{
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin-bottom: 10px;
    }
    .details .info .author{
        font-family: monospace;
        font-size: 1.1rem;
        letter-spacing: 1px;
    }
    .details .info .date{
        display: inline-block;
        color: v-bind('theme.textColorGray');
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
    .details .info .date span{
        font-weight: bold;
        text-decoration: underline;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
</style>