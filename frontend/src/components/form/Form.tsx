import React, { ReactNode } from 'react';

interface FormProps {
    style?: React.CSSProperties | null;
    title: string;
    elements: ReactNode[];
    handleSubmit: (event: React.FormEvent) => void;
    buttonText: string;
    isPending?: boolean | null;
    errors?: any | null; // You can replace 'any' with a specific error type
}

const defaultProps = {

    isPending: null,
    errors: null,
}

const Form: React.FC<FormProps> = ({

    title,
    elements,
    handleSubmit,
    buttonText,
    isPending,
    errors,
}) => {
    return (
        <form className='flex flex-col items-center justify-between  bg-white rounded shadow-lg p-5' onSubmit={(e) => {
            handleSubmit(e)
        }}>
            <h2 className="font-bold text-2xl">{title}</h2>
            <div className='flex flex-col items-center justify-center gap-3' >

           
            {elements.map(element => {

                return element


            })}
             </div>
            {errors && <div>{errors}</div>}

            <button className="flex items-center justify-center h-12 px-6 w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700" type="submit" >
                {isPending ? 'Submitting...' : buttonText}
            </button>

        </form>

    );
};
Form.defaultProps = defaultProps;
export default Form