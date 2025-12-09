"use client";
import Image from "next/image";
import FormLabel from "@/components/ui/FormLabel";
import FormInput from "@/components/ui/FormInput";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { setCookie } from "cookies-next";
import { authActions } from "@/lib/store/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("admin6@test.com");
  const [password, setPassword] = useState("@Password123");

  const { mutate: login, isPending, isError } = useLogin();

  const handleSubmitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login(
      { email, password },
      {
        onSuccess: (data) => {
          setCookie("admin_token", data.accessToken, { maxAge: 15 * 60 });

          dispatch(
            authActions.setCredentials({
              user: data.user,
              token: data.accessToken,
            })
          );

          router.push("/dashboard");
        },
        onError: (error) => {
          console.error("Login Failed: ", error);
        },
      }
    );
  };

  return (
    <div>
      <div className="border-t-4 border-t-blue-700 border border-stone-400 w-130 mx-auto mt-35 rounded-xl px-10 pb-10">
        <div className="text-center mt-8">
          <div className="bg-blue-600 w-20 mx-auto mt-10 p-5 rounded-2xl">
            <Image
              src="/hand-holding-droplet.png"
              alt="Logo"
              width={300}
              height={300}
            />
          </div>

          <h1 className="text-3xl mt-8 text-stone-900 ">Welcome Back</h1>
          <p className="mt-3 text-stone-700">
            Sign in to access your water billing account
          </p>
        </div>

        <form onSubmit={handleSubmitLogin} className="mt-10">
          <div className="grid">
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <FormInput
              type="email"
              value={email}
              htmlId="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.currentTarget.value)
              }
            />
          </div>

          <div className="grid mt-5">
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              type="password"
              value={password}
              htmlId="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.currentTarget.value)
              }
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`mt-15  text-stone-50 w-full p-4 rounded-md ${
              isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {`${isPending ? "Signing in..." : "Sign In"}`}
          </button>
        </form>

        <p className="text-center mt-5 text-stone-600">
          Don&apos;t have an account? Visit our office to register
        </p>
      </div>
    </div>
  );
}
