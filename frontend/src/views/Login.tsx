import React from 'react'
import Form from '../components/form/Form'
import Input from '../components/form/Input'
import Wrapper from '../container/Wrapper'
const Login = () => {


    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log(e.target.email)
    }

    return (
        <Wrapper>


            <Form
                title='Iniciar sesión'
                handleSubmit={handleSubmit}
                elements={[

                    <Input type='text' name='Email' />,
                    <Input type='password' name='Contraseña' />,

                ]}
                buttonText='Iniciar sesión'

            />

        </Wrapper>
    )
}

export default Login


