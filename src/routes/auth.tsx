import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

type Params = "login" | "register";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const [params, setParams] = useState<Params>("login");
  const isLoginPage = params === "login";
  const switchParams = () => {
    setParams(isLoginPage ? "register" : "login");
  };
  return (
    <main className="flex justify-center items-center min-h-screen py-10">
      <Card className="w-sm lg:w-md mx-auto">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>{isLoginPage ? "Login" : "Daftar"}</CardTitle>
            <CardDescription>
              {isLoginPage ? "Login ke akun anda" : "Daftarkan akun anda"}
            </CardDescription>
          </div>
          <ModeToggle isGhost />
        </CardHeader>
        <CardContent>
          {isLoginPage ? <LoginForm /> : <RegisterForm />}
        </CardContent>
        <CardFooter>
          <span className="flex gap-1 items-center text-xs cursor-pointer">
            {isLoginPage ? "Belum punya akun?" : "Sudah punya akun?"}
            <span
              className="underline underline-offset-2"
              onClick={switchParams}
            >
              {isLoginPage ? "daftar disini" : "login disini"}
            </span>
          </span>
        </CardFooter>
      </Card>
    </main>
  );
}
