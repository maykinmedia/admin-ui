import React from "react";
import "./test.css";

export const Foo: React.FC<React.HTMLProps<any>> = ({ ...props }) => (
  <b {...props}>foo</b>
);
