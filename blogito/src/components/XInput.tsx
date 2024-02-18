import React, { ReactNode } from "react";

type InputProps = {
  children?: React.ReactNode;
  loading?: boolean;
  model?: string;
  icon?: ReactNode;
  parentClass?: string;
  errors?: Array<string>;
} & React.ComponentPropsWithoutRef<"input">;

const XInput: React.FC<InputProps> = ({
  loading = false,
  model = "default",
  errors = null,
  children,
  icon = null,
  parentClass = "",
  ...props
}) => {
  let messages = null;
  if (errors != null && errors?.length > 0) {
    messages = (
      <ul className="errors">
        {errors.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className={parentClass}>
      <div
        className="input"
        aria-errormessage={messages != null ? "true" : "false"}
      >
        <input {...props} />
        {icon}
      </div>
      {messages}
    </div>
  );
};

export default XInput;
