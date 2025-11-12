import React, { forwardRef, useImperativeHandle, useRef } from "react";

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clearInput: () => (inputRef.current.value = ""),
  }));

  return <input ref={inputRef} {...props} className="form-control" />;
});

export default CustomInput;
