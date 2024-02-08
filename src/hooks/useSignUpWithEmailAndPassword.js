import React from 'react'
import { auth, firestore } from '../firebase/firebase';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import useShowToast from './useShowToast';
import useAuthStore from '../store/authStore';

const useSignUpWithEmailAndPassword = () => {
    // taking from react firebase hooks
    const [createUserWithEmailAndPassword,loading,error,] = useCreateUserWithEmailAndPassword(auth);
    const showToast = useShowToast()

    //for login user comping from authStore.js
    const loginUser = useAuthStore(state => state.login)

    //created function for sign up and use in SignUp.jsx component
    const signup = async (inputs) => {
        if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
            // console.log('Please fill all the fields')
            // using useShowToast hooks
            showToast("Error","Please fill all the fields","error");
            return;
        }

        const usersRef = collection(firestore ,"users");
        const q = query(usersRef, where('username','==',inputs.username))
        const querySnapshot = await getDocs(q)

        if(!querySnapshot.empty){
            showToast("Error" ,"username already exists","error");
            return;
        }
        try {
            const newUser = await createUserWithEmailAndPassword(inputs.email,inputs.password)
            if (!newUser && error) {
                // console.log(error)
                showToast("Error", error.message, 'error');
                return
            }
            if (newUser) {
                const userDoc = {
                    uid:newUser.user.uid,
                    email:inputs.email,
                    username:inputs.username,
                    fullName:inputs.fullName,
                    bio:'',
                    profilePicURL:'',
                    followers:[],
                    following:[],
                    posts:[],
                    createdAt:Date.now()
                }
                await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
                localStorage.setItem('user-info' , JSON.stringify(userDoc))
                loginUser(userDoc)
            }
        } catch (error) {
            // console.log(error)
            showToast("Error",error.message, 'error')
        }
    }
    return {loading , error,signup}

}

export default useSignUpWithEmailAndPassword