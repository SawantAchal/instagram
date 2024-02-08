import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import Comment from '../components/comment/Comment'
import usePostComment from '../hooks/usePostComment'

const CommentModal = ({ isOpen, onClose ,post}) => {
    const {isCommenting,handlePostComment} = usePostComment()
    const commentRef = useRef(null)
    //to scroll bar to be the end
    const commentContainerRef = useRef(null);
    const handleSubmitFromCommentModal = async (e) => {
        e.preventDefault()
        await handlePostComment(post.id,commentRef.current.value)
        commentRef.current.value =" ";
    }

    //to scroll bar to be the end
    useEffect(() => {
        const scrollToBottom = () => {
            commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight;
        }
        if (isOpen) {
            setTimeout(() => {
                scrollToBottom()
            }, 100);
        }
    },[isOpen,post.comments.length])


    // console.log(post)
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
		<ModalOverlay />
		<ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
		    <ModalHeader>Comments</ModalHeader>
			<ModalCloseButton />
			<ModalBody pb={6}>
				<Flex ref={commentContainerRef} mb={4} gap={4} flexDir={"column"} maxH={"250px"} overflowY={"auto"} >
                    {
                        post.comments.map((comment ,index) => (
                            <Comment key={index} comment={comment}/>
                        ))
                    }
                </Flex>
				<form style={{ marginTop: "2rem" }} onSubmit={handleSubmitFromCommentModal}>
					<Input placeholder='Comment' size={"sm"} ref={commentRef}/>
					<Flex w={"full"} justifyContent={"flex-end"}>
						<Button type='submit' ml={"auto"} size={"sm"} my={4} isLoading={isCommenting}>
							Post
						</Button>
					</Flex>
				</form>
			</ModalBody>
		</ModalContent>
	</Modal>
  )
}

export default CommentModal