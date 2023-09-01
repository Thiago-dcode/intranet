import { useState } from 'react'
import ls from 'localstorage-slim';
export default function useUserSession() {
    ls.config.encrypt = true
    const [user, _setUser] = useState<any>({});



    const setUser = (user: any) => {


        ls.set('user', user)


    }

    const getUser = () => {

        _setUser(ls.get('user'))

    }


    return [user, setUser]
}