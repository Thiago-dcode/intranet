import React, { useState } from 'react'
import { useEffect } from 'react';
import useAjax from '../../../../hooks/useAjax';

export default function RenderTd({ company, _key, value, i, handleForm }) {
    const [categoriaWeb, setCategoriaWeb] = useState(null)
    const [idCatWeb, setIdCatWeb] = useState(null);
    const [allowed, setAllowed] = useState(false);
    const [fetchCategoriaWeb, error, isPending, setConfig] = useAjax();

    const printTree = (tree, __tree = []) => {


        let _tree = __tree;


        for (let i = 0; i < tree.length; i++) {

            let obj = {

                id: tree[i].id,
                name: tree[i].name,
            }
            _tree.push(obj);

            if (!tree[i].children) continue;

            printTree(tree[i].children, _tree)


        }

        return _tree;




    }
    const handleCategoriaWeb = (id, i) => {


        setIdCatWeb(`${i}-cat.web`)
        setConfig(`/api/${company.name}/modules/combinaciones/categoriaweb?id=${id}`)
    }

    useEffect(() => {

        if (fetchCategoriaWeb && !error) {

            setCategoriaWeb(printTree(fetchCategoriaWeb.data));
        }


    }, [fetchCategoriaWeb, error])
    useEffect(() => {

        if (_key !== 'T_cat.web') return;

        setCategoriaWeb(printTree(value.data));

    }, [_key])


    useEffect(() => {

        if (categoriaWeb && idCatWeb) {

            const catWebSelect = document.getElementById(idCatWeb);


            const options = categoriaWeb.map(cat => {
                const option = document.createElement('option');
                option.classList.add('w-full')
                option.value = cat.id
                option.textContent = cat.name

                return option;

            })

            catWebSelect.replaceChildren(...options)

        }

    }, [categoriaWeb])

    const renderTd = (_key, value, i) => {


        const [type, key] = _key.split('_');

        // according to the key, the value will render different(input, select, radio...)
        // all keys from the api start with  S,A,T,OR C 
        // S: The value of that key is a simple string or number.
        // A: The value is an Array.
        // T: The value is a Tree.
        // C: The value depends on combinations.



        switch (type) {


            case 'S':

                return (
                    <td className=" W-10 px-1 border border-slate-300  text-center ">

                        <div className='overflow-auto'>
                            <input title={value} readOnly name={`${i}-${key}`} className="w-full  text-[0.7rem]" type="text" defaultValue={value} />
                        </div>

                    </td>
                );
            case 'A':

                return (

                    <td className="px-1 border-slate-300  text-center ">
                        <select name={`${i}-${key}`}  onChange={(e) => {
                            if (key === 'hombre/mujer') {
                                setAllowed(true)
                                handleCategoriaWeb(e.target.value, i)
                            }
                            handleForm(i, key, e.target.value);

                        }} className='w-10' defaultValue={value.id} id="">

                            {
                                Array.isArray(value.data) && value.data.map(obj => {

                                    return <option className='w-full' value={obj.CODIGO}>{obj.NOMBRE}</option>

                                })
                            }
                        </select>
                        {/* <input title={key[0] === '%' || key[0] === '#' ? value : null} readOnly name={`${i}-${key}`} className="w-full text-xs" type="text" defaultValue={value} /> */}
                    </td>
                )


            case 'T':
                let tree = null;
                if (key !== 'cat.web' && !allowed) {

                    tree = printTree(value.data);

                }
                else {
                    tree = categoriaWeb;
                }


                return (

                    <td className="px-1 border-slate-300  text-center ">
                        {Array.isArray(tree) && <select id={`${i}-${key}`} name={`${i}-${key}`} onChange={(e) => {

                            handleForm(i, key, e.target.value);

                        }} className='w-10' defaultValue={value.id} >

                            {
                                tree.map(branch => {

                                    return <option className='w-full' value={branch.id}>{branch.name}</option>

                                })
                            }

                        </select>}
                    </td>
                )





            default:

                return (
                    <td className=" W-10 px-1 border border-slate-300  text-center ">

                        <div className='overflow-auto'>
                            <input title={value} readOnly name={`${i}-${key}`} className="w-full  text-[0.7rem]" type="text" defaultValue={value} />
                        </div>

                    </td>
                );
        }


    }
    return (

        renderTd(_key, value, i)
    )
}
