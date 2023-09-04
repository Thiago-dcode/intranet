import { useState } from 'react'
import ls from 'localstorage-slim';
export default function useUserSession() {
    ls.config.encrypt = true
    const [user, _setUser] = useState({});



    const setUser = (user) => {


        ls.set('user', user)


    }

    const getUser = () => {

        _setUser(ls.get('user'))

    }


    return [user, setUser]
}