import React from 'react'
import useShowToast from './useShowToast'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import useAuthStore from '../store/authStore';

const useLogin = () => {
    const showToast = useShowToast()

    // taking from react firebase hooks
    const [signInWithEmailAndPassword, user, loading, error,] = useSignInWithEmailAndPassword(auth);

    //taking from authStore.js
    const loginUser = useAuthStore((state) => state.login)

    const login = async(inputs) => {
        //check feilds are empty or not
        if (!inputs.email || !inputs.password) {
            return showToast("Error","please fill all the fields","error")
        }
        try {
            //if fields are not empty
            const userCred = await signInWithEmailAndPassword(inputs.email,inputs.password);
            if (userCred) {
                //fetching data from AiFillDatabase(firebase)
                const docRef = doc(firestore,"users" ,userCred.user.uid);
                const docSnap = await getDoc(docRef)
                //set coming datat in localStorage
                localStorage.setItem('user-info' , JSON.stringify(docSnap.data()))
                loginUser(docSnap.data())
            }
        } catch (error) {
            showToast("Error",error.message,'error')
        }
    }
    return {loading,error,login}
}

export default useLogin