import {create} from "zustand";

const usePostStore = create((set) => ({
    posts:[],
    createPost:(post) => set((state) => ({posts:[post,...state.posts]})),
    //deletePost 
    deletePost : (id) => set((state) => ({posts:state.posts.filter((post) => post.id !== id)})),
    //set post
    setPosts:(posts) => set({posts}),
    //add comment 
    addComment :(postId,comment) => set((state) => ({
        posts: state.posts.map((post) =>{
            if (post.id === postId) {
                return {
                    ...post,
                    comments:[...post.comments,comment]
                }
            }
            return post;
        })
    })),
}))

export default usePostStore;