import React from "react";
import './test2.css'

export const Bar: React.FC<React.HTMLProps<any>> = ({...props}) => <b {...props}>bar</b>

