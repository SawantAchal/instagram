import React from 'react'
import PostHeader from './PostHeader'
import { Box, Image } from '@chakra-ui/react'
import PostFooter from './PostFooter'
import useGetUserProfileByID from '../../hooks/useGetUserProfileByID'

const FeedPost = ({post}) => {
  const {userProfile} = useGetUserProfileByID(post.createdBy)
  return (
    <>
        <PostHeader post={post} creatorProfile={userProfile}/>
        <Box my={2} borderRadius={4} overflow={'hidden'}>
            <Image src={post.imageURL} alt={'feed post image'}/>
        </Box>
        <PostFooter post={post} creatorProfile={userProfile}/>
    </>
  )
}

export default FeedPost