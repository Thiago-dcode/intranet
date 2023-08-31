import React from "react";

interface InputProps {
    name: string;
    content?: string;
    type: string;
    classInput: string;
    classLabel: string;
    handleInput?: (event: React.FormEvent) => void;
    style?: React.CSSProperties;



}

const defaultProps = {
    name: '',

    type: "text",
    classInput: '',
    classLabel: '',



    style: { width: "300px" },

}


export default function Input({
    name,

    type,
    classInput,
    classLabel,



    style,

}: InputProps) {
    return (
        <div>
            <label className={'font-semibold text-xs self-start'} htmlFor={name.toLocaleLowerCase()}>{name}</label>
            {type === "textarea" && (
                <textarea
                    style={style}

                    name={name.toLocaleLowerCase()}
                    id=""
                    cols={30}
                    rows={10}

                    placeholder={"Write your " + name}
                ></textarea>
            )}
            {type !== "select" && type !== 'textarea' && (
                <input
                    // onChange={({ target }) => {
                    //     handleInput(target.value);
                    // }}
                    className={'flex items-center h-12 px-4 w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2'}
                    style={style}
                    required
                    name={name.toLocaleLowerCase()}
                    placeholder={`Escribe tu ${name}`}
                    type={type}

                />
            )}
            {/* {type === "select" && (
                <select name={name}>
                    {options.map((option) => {
                        return <option value={option.id}>{option.name}</option>;
                    })}
                </select>
            )} */}
        </div>
    );

}

Input.defaultProps = defaultProps;