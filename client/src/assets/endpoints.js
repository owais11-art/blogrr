export const endpoints = {
    register: {
        path: '/user/register/',
        method: 'POST'
    },
    login: {
        path: '/user/login/',
        method: 'POST'
    },
    getBlogs: {
        path: '/blog/',
        method: 'GET'
    },
    createBlog: {
        path: '/blog/',
        method: 'POST'
    },
    commentBlog: {
        path: '/blog/comment/',
        method: 'POST'
    },

    /* Endpoints below needs parameters */
    
    getBlog: {
        path: '/blog/',
        method: 'GET'
    },
    updateBlog: {
        path: '/blog/',
        method: 'PUT'
    },
    deleteBlog: {
        path: '/blog/',
        method: 'DELETE'
    },
    likeBlog: {
        path: '/blog/like/',
        method: 'POST'
    },
    dislikeBlog: {
        path: '/blog/dislike/',
        method: 'POST'
    },
    deleteComment: {
        path: '/blog/comment/',
        method: 'DELETE'
    },
    followUser: {
        path: '/user/follow/',
        method: 'POST'
    }
}