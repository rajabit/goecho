"use client";

import XButton from "@/components/XButton";
import XInput from "@/components/XInput";
import { useState } from "react";
import {
  CheckIcon,
  UserIcon,
  AtSymbolIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import XLink from "@/components/XLink";

export default function Login() {
  const [email, setEmail] = useState("96rajabi@gmail.com");
  const [password, setPassword] = useState("123");
  const [emailError, setEmailError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);

  const onEmailChanged = (val: any) => {
    setEmail(val.target.value);
    setEmailError([]);
  };

  const onPasswordChanged = (val: any) => {
    setPassword(val.target.value);
    setPasswordError([]);
  };

  return (
    <div className="container middle">
      <div className="card min-w-96">
        <div className="title">
          <div className="grow">Login to your account</div>
          <UserIcon />
        </div>
        <hr />
        <div className="content">
          <XInput
            type="text"
            value={email}
            placeholder="Email Address"
            parentClass="my-3"
            errors={emailError}
            icon={<AtSymbolIcon />}
            onChange={onEmailChanged}
          />
          <XInput
            type="password"
            placeholder="Password"
            parentClass="mb-3"
            value={password}
            errors={passwordError}
            icon={<LockClosedIcon />}
            onChange={onPasswordChanged}
          />
        </div>
        <hr />
        <div className="actions">
          <div className="grow flex">
            <XLink
              href="/forget-password"
              className="text-blue-600"
              model="outlined"
              color="blue"
            >
              Forget Password?
            </XLink>
          </div>
          <XButton>
            <CheckIcon />
            Login
          </XButton>
        </div>
      </div>
    </div>
  );
}
