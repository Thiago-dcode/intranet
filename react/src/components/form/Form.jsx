import React, { ReactNode } from "react";

const Form = ({
  title = "",
  elements,
  handleSubmit,
  buttonText,
  isPending = null,
  error = "",
}) => {
  return (
    <form
      className="flex flex-col items-center justify-between  bg-white rounded shadow-lg p-5"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <h2 className="font-bold text-2xl">{title}</h2>
      <div className="flex flex-col items-center justify-center gap-3">
        {elements.map((element, i) => {
          return <div id={"div-input-" + i}>{element}</div>;
        })}
      </div>
      {error && <div>{error}</div>}

      <button
        className="flex items-center justify-center h-12 px-6 w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700"
        type="submit"
      >
        {isPending ? "Submitting..." : buttonText}
      </button>
    </form>
  );
};

export default Form;
