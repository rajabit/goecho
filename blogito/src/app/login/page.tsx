"use client";

import XButton from "@/components/XButton";
import XInput from "@/components/XInput";
import { useState } from "react";
import {
  ChevronRightIcon,
  UserIcon,
  AtSymbolIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import XLink from "@/components/XLink";
import api from "@/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<Array<string>>([]);
  const [passwordError, setPasswordError] = useState<Array<string>>([]);

  const router = useRouter();

  const onEmailChanged = (val: any) => {
    setEmail(val.target.value);
    setEmailError([]);
  };

  const onPasswordChanged = (val: any) => {
    setPassword(val.target.value);
    setPasswordError([]);
  };

  const login = async () => {
    setLoading(true);
    setEmailError([]);
    setPasswordError([]);

    api
      .login({ email, password })
      .then((val) => {
        localStorage.setItem("jwt", val.Token ?? "");
        delete val.Token;
        localStorage.setItem("user", JSON.stringify(val));
        toast.success(`Welcome Back ${val.Name}`);
        router.push("/dashboard");
      })
      .catch(async (reason) => {
        if (reason.status == 401) {
          setEmailError(["Invalid credential"]);
        } else if (reason.status == 400) {
          let errors = await reason.json();
          if (errors["LoginRequest.Email"])
            setEmailError([errors["LoginRequest.Email"]]);
          if (errors["LoginRequest.Password"])
            setPasswordError([errors["LoginRequest.Password"]]);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container middle flex-col">
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
          <XLink
            href="/forget-password"
            model="outlined"
            color="blue"
            className="ml-auto w-fit"
          >
            Forget Password?
          </XLink>
        </div>
        <hr />
        <div className="actions">
          <XLink
            href="/register"
            model="outlined"
            color="blue"
            className="ml-auto w-fit"
          >
            Create an account
          </XLink>
          <div className="grow flex"></div>
          <XButton
            loading={loading}
            loading_message="Logging in..."
            onClick={login}
          >
            <ChevronRightIcon />
            Login
          </XButton>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
