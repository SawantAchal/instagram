import React from 'react'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import useShowToast from './useShowToast'
import usePostStore from '../store/postStore'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebase/firebase'

const usePostComment = () => {
    const [isCommenting , setIscommeting] = useState(false)
    const showToast = useShowToast()
    const authUser = useAuthStore(state =>state.user)
    const addComment = usePostStore(state => state.addComment)
    
    const handlePostComment = async(postId , comment) => {
        if(isCommenting) return;
        if(!authUser) return showToast("Error" ,"You must Logged in to comment " ,"error")
        setIscommeting(true)
        const newComment ={ 
            comment,
            createdAt:Date.now(),
            createdBy:authUser.uid,
            postId
        }
        try {
            await updateDoc(doc(firestore,"posts",postId),{
              comments :arrayUnion(newComment)
            })
            addComment(postId,newComment)
        } catch (error) {
            showToast("Error",error.message,"error")
        }finally{
          setIscommeting(false)
        }
    }
  return {isCommenting,handlePostComment}
}

export default usePostComment