import React from "react";
import LoadingSVG from "@/components/svg/LoadingSVG";

type ButtonProps = {
  children?: React.ReactNode;
  loading_message?: string;
  loading?: boolean;
  model?: string;
  color?: string;
  to?: string;
} & React.ComponentPropsWithoutRef<"button">;

const XButton: React.FC<ButtonProps> = ({
  to = null,
  loading = false,
  loading_message = "Processing...",
  color = "primary",
  model = "default",
  children,
  ...props
}) => {
  let content = loading ? (
    <>
      <LoadingSVG />
      {loading_message}
    </>
  ) : (
    <>{children}</>
  );

  const className = `btn ${model} ${color}`;

  return (
    <button className={className} {...props}>
      {content}
    </button>
  );
};

export default XButton;
