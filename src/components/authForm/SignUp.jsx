import React, { useState } from 'react'
import { Alert, AlertIcon, Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useSignUpWithEmailAndPassword from '../../hooks/useSignUpWithEmailAndPassword';

const SignUp = () => {
    const [inputs , setInputs] = useState({email : '' , password:'' ,username:'' , fullName:''})
    const [showPassword , setShowPassword] = useState(false);
    const {loading,error,signup} = useSignUpWithEmailAndPassword()

  return (
    <>
        <Input placeholder='Email' fontSize={14} type='email' value={inputs.email} onChange={(e) => setInputs({...inputs,email:e.target.value})} size={'sm'}/>
        <Input placeholder='username' fontSize={14} type='text' value={inputs.username} onChange={(e) => setInputs({...inputs,username:e.target.value})} size={'sm'}/>
        <Input placeholder='fullname' fontSize={14} type='text' value={inputs.fullName} onChange={(e) => setInputs({...inputs,fullName:e.target.value})} size={'sm'}/>
        <InputGroup>
            <Input placeholder='Password' fontSize={14} type={showPassword ? 'text' : 'password'} value={inputs.password} onChange={(e) => setInputs({...inputs,password:e.target.value})} size={'sm'} />
            <InputRightElement h={'full'}>
                <Button variant={'ghost'} size={'sm'} onClick={() => setShowPassword(!showPassword)}>
                    {
                        showPassword ? <ViewIcon/> : <ViewOffIcon />
                    }
                </Button>
            </InputRightElement>
        </InputGroup>
        {
            error && (
                <Alert status='error' fontSize={13} p={2} borderRadius={4}>
                    <AlertIcon fontSize={12}/>
                    {error.message}
                </Alert>
            )
        }
        <Button w={'full'} colorScheme='blue' size={'sm'} fontSize={14} onClick={() => signup(inputs)} isLoading={loading}>Sign up</Button>
    </>
  )
}

export default SignUp