"use client";

import { useState, useContext, FormEvent } from "react";
import AuthContext from "../../utils/AuthContext";

import Head from "next/head";
import Link from "next/link";
import {
  FaFacebookF,
  FaGoogle,
  FaLinkedin,
  FaRegEnvelope,
} from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";

export default function LoginPage() {
  const context = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = context?.login;

  console.log(context);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!login) {
      throw new Error("Login function not available");
    }
    await login(email, password);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <div className="bg-white rounded-2xl flex w-2/3 max-w-4xl">
            <div className="w-3/5 p-5">
              <div className="text-left font-bold">
                <span className="text-green-500">Company</span> Name
              </div>
              <div className="py-10">
                <h2 className="text-3xl font-bold text-green-500 mb-2">
                  Sign in to Account
                </h2>
                <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>
                <div className="flex justify-center my-2">
                  <Link
                    href={"#"}
                    className="border-2 border-gray-200 rounded-full p-3 mx-1"
                  >
                    <FaFacebookF className="text-sm" />
                  </Link>
                  <Link
                    href={"#"}
                    className="border-2 border-gray-200 rounded-full p-3 mx-1"
                  >
                    <FaLinkedin className="text-sm" />
                  </Link>
                  <Link
                    href={"#"}
                    className="border-2 border-gray-200 rounded-full p-3 mx-1"
                  >
                    <FaGoogle className="text-sm" />
                  </Link>
                </div>
                <p className="text-gray-400">or use your email account</p>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <FaRegEnvelope className="text-gray-400 m-2" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="bg-gray-100 outline-none text-sm"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <MdLockOutline className="text-gray-400 m-2" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="bg-gray-100 outline-none text-sm"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between w-64 mb-5">
                    <label className="flex items-center text-xs">
                      <input type="checkbox" name="remember" className="mr-1" />
                      Remember Me
                    </label>
                    <Link href={"#"} className="text-xs">
                      Forgot Password?
                    </Link>
                  </div>
                  <Link
                    onClick={handleLogin}
                    href={"#"}
                    className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-2/5 bg-green-500 text-white rounded-tr-2xl py-36 px-12">
              <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
              <div className="border-2 w-10 border-white inline-block"></div>
              <p className="mb-10">
                Fill up personal information and start journey with us.
              </p>
              <Link
                href={"#"}
                className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
