import { loginSchema, LoginSchemaType } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { authClient } from "@/lib/authClient";
import { useRouter } from "@tanstack/react-router";

const LoginForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    try {
      const { data } = await authClient.signIn.email(values, {
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

  const isFormBusy = form.formState.isLoading || form.formState.isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {form.formState.errors.root?.message && (
        <FieldError errors={[form.formState.errors.root]} />
      )}
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
              <Input
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder="*********"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
          "Login"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
