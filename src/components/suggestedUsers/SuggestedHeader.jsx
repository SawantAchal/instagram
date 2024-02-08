import { Avatar, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import useLogout from '../../hooks/useLogout'
import useAuthStore from '../../store/authStore'
import { Link } from 'react-router-dom'

const SuggestedHeader = () => {
  const {handleLogout, isLogginOut} = useLogout()
  const authUser = useAuthStore((state) =>state.user)
    // Add a conditional check for authUser
    if (!authUser) {
      // Handle the case where authUser is null
      return null; // or return a loading state or redirect the user
    }
  return (
    <Flex justifyContent={'space-between'} alignItems={'center'} w={'full'}>
        <Flex alignItems={'center'} gap={2}>
          <Link to={`${authUser.username}`}>
            <Avatar size={'lg'} src={authUser.profilePicURL}/>
          </Link>
          <Link to={`${authUser.username}`}>
            <Text fontSize={12} fontWeight={'bold'}>
              {authUser.username}
            </Text>
          </Link>
        </Flex>
        <Button size={'xs'}  background={'transparent'} _hover={{background:'transparent'}} fontSize={14} fontWeight={'medium'} color={'blue.400'}  cursor={'pointer'} isLoading={isLogginOut} onClick={handleLogout}>Log out</Button>
    </Flex>
  )
}

export default SuggestedHeader