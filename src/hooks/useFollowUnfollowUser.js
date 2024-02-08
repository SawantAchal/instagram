import React, { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import useUserProfileStore from '../store/userProfileStore'
import useShowToast from './useShowToast'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebase/firebase'

const useFollowUnfollowUser = (userId) => {
    const [isUpdating , setIsUpadating] = useState(false)
    const [isFollowing , setIsFollowing] = useState(false)
    const authUser = useAuthStore((state) => state.user)
    const setAuthUser = useAuthStore((state) => state.setUser)
    const {userProfile , setUserProfile} = useUserProfileStore()
    const showToast = useShowToast()

    const handleFollowUser = async () => {
        setIsUpadating(true)
        try {
            const currentUserRef = doc(firestore,"users",authUser.uid)
            const userToFollowOrUnfollowRef = doc(firestore,"users",userId)

            await updateDoc(currentUserRef,{
                // if following then remove user id , if not then add userid into array
                following:isFollowing ? arrayRemove(userId) : arrayUnion(userId)
            })

            await updateDoc(userToFollowOrUnfollowRef,{
                followers: isFollowing ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid)
            })

            // check user is fllow or not
            if(isFollowing){
                //unfollow the is user
                setAuthUser({
                    ...authUser,
                    following:authUser.following.filter((uid) => uid !== userId)
                })
                if(userProfile)
                    setUserProfile({
                        ...userProfile,
                        followers:userProfile.followers.filter((uid) => uid !== authUser.uid)
                    })
                localStorage.setItem("user-info",JSON.stringify({
                    ...authUser,
                    following:authUser.following.filter((uid) => uid !== userId)
                }))
                setIsFollowing(false)
            }else{
                //follow
                setAuthUser({
                    ...authUser,
                    following : [...authUser.following, userId]
                })
                if (userProfile) 
                    setUserProfile({
                        ...userProfile,
                        followers:[...userProfile.followers,authUser.uid]
                    })
                localStorage.setItem("user-info" , JSON.stringify({
                    ...authUser,
                    following:[...authUser.following,userId]
                }))
                setIsFollowing(true)
            }
        } catch (error) {
            showToast("Error",error.message,"error")
        }finally{
            setIsUpadating(false)
        }
    }

    // checking user is authenticate or not
    useEffect(() =>{
        if (authUser) {
            const isFollowing = authUser.following.includes(userId)
            setIsFollowing(isFollowing)
        }
    },[authUser,userId])
  return {isUpdating , isFollowing ,handleFollowUser}
}

export default useFollowUnfollowUser