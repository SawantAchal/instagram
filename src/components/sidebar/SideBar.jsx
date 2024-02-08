import { Box, Button, Flex, Link, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { InstagramLogo, InstagramMobileLogo } from '../../assets/constant'
import {BiLogOut} from 'react-icons/bi'
import useLogout from '../../hooks/useLogout'
import SidebarItems from './SidebarItems'

const SideBar = () => {
  const {handleLogout , isLoggingOut} = useLogout()

  return (
    <Box height={'100vh'} borderRadius={'1px solid'} borderColor={'whiteAlpha.300'} py={8} position={'sticky'} top={0} left={0} px={{base:2 , md:4}}>
      <Flex direction={'column'} gap={10} w={'full'} height={'full'}>
        {/* for medium screen */}
        <Link to={'/'} as={RouterLink} pl={2} display={{base:'none' , md:'block'}} cursor={'pointer'}>
          <InstagramLogo/>
        </Link>
        {/* mobile screen */}
        <Link to={'/'} as={RouterLink} p={2} display={{base:'block' , md:'none'}} cursor={'pointer'} borderRadius={6} _hover={{bg:'whiteAlpha.200'}} w={10}>
          <InstagramMobileLogo/>
        </Link>
        {/* side bar icons */}
        <Flex direction={'column'} gap={5} cursor={'pointer'}>
          <SidebarItems/>
        </Flex>
        {/* logout */}
        <Tooltip hasArrow label={'Logout'} placement='right' ml={1} openDelay={500} display={{base:'block' , md:'none' }}>
          <Flex onClick={handleLogout} alignItems={'center'} gap={4} _hover={{bg:'whiteAlpha.400'}} borderRadius={6} p={2} w={{base:10 , md:'full'}} justifyContent={{base:'center' , md:'flex-start'}} mt={'auto'}>
            <BiLogOut size={25}/>
            <Button variant={'ghost'} display={{base:'none', md:'block'}} _hover={{bg:'transparent'}} isLoading={isLoggingOut}>
              Logout
            </Button>
          </Flex>
        </Tooltip>
      </Flex>
    </Box>
  )
}

export default SideBar