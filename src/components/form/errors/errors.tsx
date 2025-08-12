import { forceArray } from "@maykin-ui/client-common";
import React from "react";

import { Body } from "../../typography";
import { ErrorMessage, ErrorMessageProps } from "../errormessage";

export type ErrorsProps = {
  errors: ErrorMessageProps["children"] | ErrorMessageProps["children"][];
  errorMessageProps?: ErrorMessageProps;
};

export const Errors: React.FC<ErrorsProps> = ({
  errors = [],
  errorMessageProps,
}) => {
  const _errors = forceArray(errors);

  return _errors.length > 0 ? (
    <Body>
      {_errors.map((e) => (
        <ErrorMessage key={String(e)} {...errorMessageProps}>
          {e}
        </ErrorMessage>
      ))}
    </Body>
  ) : null;
};
