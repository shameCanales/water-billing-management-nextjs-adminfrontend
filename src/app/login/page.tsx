"use client";
import Image from "next/image";
import FormLabel from "@/components/ui/FormLabel";
import FormInput from "@/components/ui/FormInput";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/useLogin";
import { setCookie } from "cookies-next";
import { authActions } from "@/lib/store/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
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
      <div className="border-t-4 border-t-blue-700 border border-stone-200 w-100 mx-auto mt-30 rounded-lg px-8 pb-10 shadow-xl overflow-hidden relative">
        <div className="text-center mt-8">
          <div className="bg-blue-600 w-17 mx-auto mt-8 p-5 rounded-2xl">
            <Image
              src="/hand-holding-droplet.png"
              alt="Logo"
              width={300}
              height={300}
            />
          </div>

          <h1 className="text-3xl mt-10 text-stone-900 ">Welcome Back</h1>
          <p className="mt-4 text-sm text-stone-500">
            Sign in to access your water billing account
          </p>
        </div>

        <form onSubmit={handleSubmitLogin} className="mt-10">
          <div className="grid">
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              type="email"
              value={email}
              htmlId="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.currentTarget.value)
              }
              placeholder="Enter your email address"
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
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`mt-15  text-stone-50 w-full py-3.5 px-4 text-sm font-semibold rounded-md ${
              isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-600"
            }`}
          >
            {`${isPending ? "Signing in..." : "Sign In"}`}
          </button>
        </form>

        <div className="mt-10 border-stone-200 bg-stone-100 border py-4 rounded-xl ">
          <p className="text-center text-xs text-stone-500">
            Don&apos;t have an account?{" "}
            <span className="text-blue-600">Visit our office to register</span>
          </p>
        </div>
      </div>
    </div>
  );
}
