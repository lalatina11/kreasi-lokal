import { registerSchema, RegisterSchemaType } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { authClient } from "@/lib/authClient";
import { Check, Eye, EyeOff } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";

const RegisterForm = () => {
  const [isShowPassword, setIsShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user" as RegisterSchemaType["role"],
    },
  });
  const router = useRouter();

  const onSubmit = async (values: RegisterSchemaType) => {
    try {
      if (values.password !== values.confirmPassword) {
        return form.setError("confirmPassword", {
          message: "Konfirmasi Password tidak sama dengan Password",
        });
      }
      type RoleWithAdmin = RegisterSchemaType["role"] & "admin";
      if ((values.role as RoleWithAdmin) === "admin") {
        throw new Error("Anda tidak diperkenankan membuat akun admin disini");
      }
      const { data } = await authClient.signUp.email(values, {
        onError: ({ error }) => {
          throw new Error(error.message);
        },
      });
      await authClient.getSession({
        fetchOptions: {
          headers: { authorization: `Bearer ${data?.token}` },
          onSuccess: ({ data }) => {
            const { role } = data.user;
            toast.success(`Berhasil mendaftar sebagai ${role}`);
            router.navigate({
              to:
                role === "user" || role === "merchant"
                  ? "/feeds"
                  : "/dashboard/admin",
            });
          },
        },
      });
    } catch (error) {
      const { message } = error as Error;
      form.setError("root", { message });
      toast.error(message, { action: { label: "Oke", onClick: () => {} } });
    }
  };

  const isUser = form.watch().role === "user";

  const isFormBusy = form.formState.isLoading || form.formState.isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {form.formState.errors.root && (
        <FieldError errors={[form.formState.errors.root]} />
      )}
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Nama lengkap</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="John Doe"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                {...field}
                id="username"
                aria-invalid={fieldState.invalid}
                placeholder="johndoe"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="johndoe@email.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="*********"
                  autoComplete="off"
                  type={isShowPassword.password ? "text" : "password"}
                />
                <InputGroupButton
                  onClick={() =>
                    setIsShowPassword((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                >
                  {isShowPassword.password ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">
                Konfirmasi Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="confirmPassword"
                  aria-invalid={fieldState.invalid}
                  placeholder="*********"
                  autoComplete="off"
                  type={isShowPassword.confirmPassword ? "text" : "password"}
                />
                <InputGroupButton
                  onClick={() =>
                    setIsShowPassword((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                >
                  {isShowPassword.confirmPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          name="role"
          control={form.control}
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">Daftar Sebagai</FieldLabel>
              <div className="flex-1 flex gap-2">
                <Button
                  type="button"
                  onClick={() => form.setValue("role", "user")}
                  className="flex-1/2 transition-all ease-in-out duration-300"
                  variant={isUser ? "default" : "outline"}
                >
                  {isUser && <Check />}
                  Pelanggan
                </Button>
                <Button
                  type="button"
                  onClick={() => form.setValue("role", "merchant")}
                  className="flex-1/2 transition-all ease-in-out duration-300"
                  variant={!isUser ? "default" : "outline"}
                >
                  {!isUser && <Check />}
                  Pedagang
                </Button>
              </div>
            </Field>
          )}
        />
      </FieldGroup>
      <Button disabled={isFormBusy} type="submit">
        {isFormBusy ? (
          <>
            <Spinner />
            Loading...
          </>
        ) : (
          "Daftar"
        )}
      </Button>{" "}
    </form>
  );
};

export default RegisterForm;
