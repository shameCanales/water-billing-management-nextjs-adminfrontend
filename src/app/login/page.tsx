"use client";
import Image from "next/image";
import FormLabel from "@/components/ui/form/FormLabel";
import FormInput from "@/components/ui/form/FormInput";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/useLogin";
import { setCookie } from "cookies-next";
import { authActions } from "@/lib/store/authSlice";
import { z } from "zod/v3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { mutate: login, isPending, isError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "shamecanales1082@gmail.com", // Kept your default for easy testing
      password: "devShame1082@",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: (responseData) => {
          setCookie("admin_token", responseData.accessToken, {
            maxAge: 15 * 60,
          });

          dispatch(
            authActions.setCredentials(responseData.user)
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

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
          {/* Email Field */}
          <div className="grid">
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              type="email"
              placeholder="Enter your email address"
              // Connect React Hook Form
              {...register("email")}
            />
            {/* Validation Error Message */}
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="grid mt-5">
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              id="password"
              type="password"
              placeholder="Enter your password"
              // Connect React Hook Form
              {...register("password")}
            />
            {/* Validation Error Message */}
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {isError && (
            <div className="mt-5 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-xs text-red-800 text-center font-medium">
                Invalid credentials. Please try again.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`mt-8 text-stone-50 w-full py-3.5 px-4 text-sm font-semibold rounded-md transition-colors ${
              isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? "Signing in..." : "Sign In"}
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
