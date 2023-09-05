import { useState } from "react";

export const useValidateToken = () => {
  const [isValid, setIsValid] = useState(false);

  return isValid;
};
