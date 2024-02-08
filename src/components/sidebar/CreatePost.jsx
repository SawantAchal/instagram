import { Box, Button, CloseButton, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Tooltip, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { CreatePostLogo } from '../../assets/constant'
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from '../../hooks/usePreviewImg';
import useShowToast from '../../hooks/useShowToast';
import usePostStore from '../../store/postStore';
import useAuthStore from '../../store/authStore'
import useUserProfileStore from '../../store/userProfileStore';
import { useLocation } from 'react-router-dom';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // for <caption
  const [caption , SetCaption] = useState('')
  // to use image 
  const imageRef = useRef(null)
  // for render selected image
  const {selectedFile,handleImageChange,setSelectedFile} = usePreviewImg()
  const {isLoading,handleCreatePost} = useCreatePost()
  const showToast = useShowToast()

  const handlePostImages = async() =>{
    try {
      await handleCreatePost(selectedFile,caption);
      onClose();
      SetCaption("");
      setSelectedFile(null)
    } catch (error) {
      showToast("Error",error.message,"error")
    }
  }
  return (
    <>
      <Tooltip hasArrow label={"Create"} placement='right' ml={1} openDelay={500} display={{base:"block" , md:"none"}}>
        <Flex alignItems={'center'} gap={4} _hover={{bg:'whiteAlpha.400'}} borderRadius={6} p={2} w={{base:10, md:'full'}} justifyContent={{base:"center",md:'flex-start'}} onClick={onOpen}>
          <CreatePostLogo />
          <Box display={{base:"none",md:"block"}}>Create</Box>
        </Flex>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
				<ModalOverlay />
				<ModalContent bg={"black"} border={"1px solid gray"}>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Textarea placeholder='Post caption...' value={caption} onChange={(e) =>SetCaption(e.target.value)}/>
						<Input type='file' hidden  ref={imageRef} onChange={handleImageChange}/>
						<BsFillImageFill style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }} size={16} onClick={()=>imageRef.current.click()} />
            {
              selectedFile && (
                <Flex mt={5} w={'full'} position={'relative'} justifyContent={'center'}>
                  <Image src={selectedFile} alt='selected img'/>
                  <CloseButton position={'absolute'} top={2} right={2} onClick={() => setSelectedFile(null)}/>
                </Flex>
              )
            }
					</ModalBody>
					<ModalFooter>
						<Button mr={3} onClick={handlePostImages} isLoading={isLoading}>Post</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
    </>
  )
}

export default CreatePost


// custom hook for create Post
function useCreatePost() {
  const showToast = useShowToast();
  const [isLoading , setIsLoading] = useState(false)
  const authUser = useAuthStore((state) => state.user)
  const createPost = usePostStore(state => state.createPost)
  const addPost = useUserProfileStore(state => state.addPost)
  const userProfile = useUserProfileStore(state => state.userProfile)
  const {pathname} = useLocation()

  const handleCreatePost = async (selectedFile,caption) => {
    if (isLoading) return;
    if (!selectedFile) throw new Error('please select an image')
    setIsLoading(true);
    const newPost ={
      caption:caption,
      likes:[],
      comments:[],
      createdAt:Date.now(),
      createdBy:authUser.uid,
    }
    try {
      const postDocRef = await addDoc(collection(firestore,"posts"),newPost)
      const userDocRef = doc(firestore,"users",authUser.uid)
      const imageRef = ref(storage ,`posts/${postDocRef.id}`)
      await updateDoc(userDocRef,{posts:arrayUnion(postDocRef.id)})
      await uploadString(imageRef,selectedFile,"data_url")
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(postDocRef,{imageURL:downloadURL});

      newPost.imageURL = downloadURL;
      //user ani post karnar same asel tr proffile madeh post add (image) add karto 
      if(userProfile.uid === authUser.uid)createPost({...newPost,id:postDocRef.id})
      //checks karto ki post karanar ani account login asnar same ahe asel tr post madhe count add karto ny tr 
      if (pathname !== "/" && userProfile.uid === authUser.uid) addPost({...newPost,id:postDocRef.id})
      showToast("success","post create successfully","success")

    } catch (error) {
      showToast("Error",error.message,"error")
    }finally{
      setIsLoading(false)
    }
  }
  return {isLoading,handleCreatePost}
}