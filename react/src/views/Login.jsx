import React from 'react'
import Form from '../components/form/Form'
import Input from '../components/form/Input'

function Login  () {


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(e.target.email)
    }

    return (


            <Form
                title='Iniciar sesión'
                handleSubmit={handleSubmit}
                elements={[

                    <Input type='text' name='Email' />,
                    <Input type='password' name='Contraseña' />,

                ]}
                buttonText='Iniciar sesión'

            />

    )
}

export default Login


