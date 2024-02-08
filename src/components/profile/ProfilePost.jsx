import { Avatar, Box, Button, Divider, Flex, GridItem, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, VStack, useDisclosure, useShortcut } from '@chakra-ui/react'
import React, { useState } from 'react'
import {AiFillHeart} from 'react-icons/ai'
import { FaComment } from "react-icons/fa";
import  {MdDelete  } from "react-icons/md";
import Comment from '../comment/Comment';
import PostFooter from '../feedPosts/PostFooter';
import useUserProfileStore from '../../store/userProfileStore';
import useAuthStore from '../../store/authStore';
import useShowToast from '../../hooks/useShowToast';
import { deleteObject, ref } from 'firebase/storage';
import { firestore, storage } from '../../firebase/firebase';
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import usePostStore from '../../store/postStore';
import Caption from '../comment/Caption';

const ProfilePost = ({post}) => {
    const userProfile = useUserProfileStore((state) => state.userProfile)
    // for modal
    const {isOpen , onOpen ,onClose} = useDisclosure()
    const authUser = useAuthStore((state) => state.user)
    const showToast = useShowToast()
    const [isDeleting , setIsDeleting] = useState(false)
    const deletePost = usePostStore((state) => state.deletePost)
    const decrementPostsCount = useUserProfileStore((state) => state.deletePost)
    // console.log(post)

    // for detele post 
    const handleDeletePost = async() => {
        if(!window.confirm("Are you sure you want to delete the post?")) return;
        if(isDeleting) return;
        try {
            const imageRef = ref(storage,`posts/${post.id}`)
            await deleteObject(imageRef)
            const userRef = doc(firestore,"users",authUser.uid);
            await deleteDoc(doc(firestore,'posts' ,post.id))
            await updateDoc(userRef,{
                posts :arrayRemove(post.id)
            })
            deletePost(post.id);
            decrementPostsCount(post.id)
            showToast("Success" ,"Post deleted successfully" ,"success")
        } catch (error) {
            showToast("Error",error.message ,"error")
        }finally{
            setIsDeleting(false)
        }
    }

  return (
    <>
        <GridItem cursor={'pointer'} borderRadius={4} overflow={'hidden'} border={'1px solid'} position={'relative'} aspectRatio={1/1} onClick={onOpen}>
            <Flex opacity={0} _hover={{opacity:1}} position={'absolute'} top={0} left={0} right={0} bottom={0} bg={'blackAlpha.700'} transition={'ease all 0.3s'} zIndex={1} justifyContent={'center'}>
                <Flex alignItems={'center'} justifyContent={'center'} gap={50}>
                    <Flex>
                        <AiFillHeart size={20} />
                        <Text fontWeight={'bold'} ml={2}>{post.likes.length}</Text>
                    </Flex>
                    <Flex>
                        <FaComment size={20} />
                        <Text fontWeight={'bold'} ml={2}>{post.comments.length}</Text>
                    </Flex>
                </Flex>
            </Flex>
            <Image src={post.imageURL} alt='profile post' w={'100%'} h={'100%'} objectFit={'cover'}/>
        </GridItem>
        <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={{ base: "3xl", md: "5xl" }}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody bg={'black'} pb={5}>
                    {
                        authUser?.uid === userProfile.uid && (
                            <Button  size={'sm'} bg={'transparent'} _hover={{bg:'whiteAlpha.300' , color:'red.600'}} borderRadius={4} p={1} onClick={handleDeletePost} isLoading={isDeleting}>
                                <MdDelete size={20} cursor={'pointer'}/>
                            </Button>
                        )
                    }
                    <Divider my={4} bg={'gray.800'} display={{base:'flex', md:'none'}}/>
                    <Flex gap={4}  mx={'auto'} maxH={'90vh'} maxW={'50vh'} w={{ base: "90%", sm: "70%", md: "full" }} direction={{ base: 'column', md: 'row' }} justifyContent='center'>
                        <Flex alignItems={'center'} gap={4}  display={{base:'flex', md:'none'}}>
                            <Avatar src={userProfile.profilePicURl} size={'sm'} name='as a programmer'/>
                            <Text fontWeight={'bold'} fontSize={12}>{userProfile.username}</Text>
                        </Flex>
                        <Flex justifyContent={'center'} alignItems={'center'}  borderRadius={4} overflow={'hidden'} border={'1px solid'} borderColor={'whiteAlpha.300'} flex={1.5}>
                            <Image src={post.imageURL} alt='profile post' />
                        </Flex>
                        <Flex flex={1} flexDir={'column'} px={10}>
                            <Flex alignItems={'center'} justifyContent={'space-between'}>
                                <Flex alignItems={'center'} gap={4} display={{base:'none', md:'flex'}}>
                                    <Avatar src={userProfile.profilePicURL} size={'sm'} />
                                    <Text fontWeight={'bold'} fontSize={12}>{userProfile.username}</Text>
                                </Flex>
                                {
                                    authUser?.uid === userProfile.uid && (
                                        <Button display={{base:'none', md:'flex'}} size={'sm'} bg={'transparent'} _hover={{bg:'whiteAlpha.300' , color:'red.600'}} borderRadius={4} p={1} onClick={handleDeletePost} isLoading={isDeleting}>
                                            <MdDelete size={20} cursor={'pointer'}/>
                                        </Button>
                                    )
                                }
                            </Flex>
                            <Divider my={4} bg={'gray.500'} display={{base:'none', md:'flex'}}/>
                            <VStack w={'full'} alignItems={'start'} maxH={'350px'} overflowY={'auto'}>
                                {/* for caption */}
                                {
                                    post.caption && <Caption post={post}/>
                                }
                                {/* for comment */}
                                {
                                    post.comments.map((comment) => (
                                        <Comment key={comment.id} comment={comment} />
                                    ))
                                }
                            </VStack>
                            <Divider my={4} bg={'gray.800'}/>
                            <PostFooter  isProfilePage={true} post={post}/>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
  )
}

export default ProfilePost