import React from "react";

type LinkProps = {
  children?: React.ReactNode;
  model?: string;
  color?: string;
} & React.ComponentPropsWithoutRef<"a">;

const XLink: React.FC<LinkProps> = ({
  color = "primary",
  model = "default",
  children,
  ...props
}) => {
  const className = `btn ${model} ${color} ${props.className ?? ""}`;
  delete props.className;

  return (
    <a className={className} {...props}>
      {children}
    </a>
  );
};

export default XLink;
