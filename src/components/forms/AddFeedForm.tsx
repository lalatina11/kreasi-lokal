import { createFeedSchema, CreateFeedSchemaType } from "@/lib/formSchema";
import { createFeedAction } from "@/server/actions/feed";
import { getAllProductsByIsLoggedInMerchant } from "@/server/renders/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button, buttonVariants } from "../ui/button";
import { Plus, RefreshCcw, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "../ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

interface Props {
  allProducts: Awaited<ReturnType<typeof getAllProductsByIsLoggedInMerchant>>;
}

const AddFeedForm = ({ allProducts }: Props) => {
  const router = useRouter();

  const [products, setProducts] = useState(allProducts);
  const [forFilterProducts, setForFilterProducts] = useState(allProducts);

  const handleSelectProducts = (id: string) => {
    form.setValue("productId", id);
    setProducts([]);
  };

  const handleClearSelectedProduct = () => {
    form.setValue("productId", "");
    setProducts(allProducts);
    setForFilterProducts(allProducts);
  };

  const form = useForm({
    resolver: zodResolver(createFeedSchema),
    defaultValues: {
      text: "",
      image: undefined,
      productId: "",
    },
  });

  const selectedProductId = form.watch().productId;

  const filteredProduct = allProducts.filter(
    (product) => product.id === selectedProductId
  );

  const handleSearchProducts = (val: string) => {
    if (val) {
      setForFilterProducts((prev) =>
        prev.filter((product) => product.name.includes(val))
      );
    } else {
      setForFilterProducts(allProducts);
    }
  };

  const onSubmit = async (values: CreateFeedSchemaType) => {
    if (!values.image && !values.text) {
      return form.setError("root", {
        message: "Isi setidaknya gambar atau deskripsi!",
      });
    }

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (!values.image) {
        formData.delete("image");
      }
      await createFeedAction({ data: formData });
      form.reset();
      setProducts(allProducts);
      await router.invalidate();
      toast.success("Berhasil membuat feed!", {
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
    } catch (error) {
      const { message } = error as Error;
      toast.error("Gagal membuat feed", {
        description: message,
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
      form.setError("root", { message });
    }
  };

  const imagePreviewUrl = form.watch().image
    ? URL.createObjectURL(form.watch().image as File)
    : "";

  const isFormBusy = form.formState.isLoading || form.formState.isSubmitting;
  return (
    <Card className="w-sm lg:w-md mx-auto">
      <CardHeader>
        <CardTitle>Tambahkan Postingan</CardTitle>
        <CardDescription>Buatlah postingan menarik</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldError
            errors={[form.formState.errors.root]}
            className="mb-2 flex justify-center items-center"
          />
          <FieldGroup>
            <Controller
              control={form.control}
              name="text"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                  <Textarea {...field} id={field.name} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={"feed" + field.name}>
                    Bagikan Gambar
                  </FieldLabel>
                  {imagePreviewUrl ? (
                    <div className="flex flex-col gap-3">
                      <img src={imagePreviewUrl} className="w-full h-auto" />
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          htmlFor={"feed" + field.name}
                          className={
                            "" + buttonVariants({ variant: "outline" })
                          }
                        >
                          <RefreshCcw />
                          Ganti gambar
                        </label>
                        <span
                          onClick={() => {
                            form.setValue("image", undefined);
                          }}
                          className={
                            "" + buttonVariants({ variant: "destructive" })
                          }
                        >
                          <Trash />
                          Hapus
                        </span>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor={"feed" + field.name}
                      className={"" + buttonVariants({ variant: "outline" })}
                    >
                      <Plus />
                      Tambahkan gambar
                    </label>
                  )}
                  <Input
                    id={"feed" + field.name}
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target?.files?.length
                        ? e.target.files[0]
                        : undefined;
                      if (file) {
                        form.setValue("image", file);
                      } else {
                        form.setValue("image", undefined);
                      }
                    }}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="productId"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tautkan produk</FieldLabel>
                  {products.length > 0 && (
                    <ScrollArea className="max-h-full h-full w-full rounded-md border">
                      <Command className="w-full p-1">
                        <Input
                          className="w-full"
                          onChange={(e) => handleSearchProducts(e.target.value)}
                          placeholder="Cari produk..."
                        />
                        <CommandList>
                          {/* <CommandEmpty>No results found.</CommandEmpty> */}
                          <CommandGroup heading="Produk yang bisa ditautkan">
                            {forFilterProducts.map((product) => (
                              <Button
                                type="button"
                                className="w-full flex justify-normal"
                                variant="ghost"
                                onClick={() => handleSelectProducts(product.id)}
                                key={product.id}
                              >
                                <Avatar>
                                  <AvatarImage src={product.image as string} />
                                  <AvatarFallback>-</AvatarFallback>
                                </Avatar>
                                <span>{product.name}</span>
                              </Button>
                            ))}
                            {forFilterProducts.length < 1 && (
                              <CommandEmpty className="text-muted-foreground text-xs flex justify-center items-center">
                                Tidak ada produk yang sesuai
                              </CommandEmpty>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </ScrollArea>
                  )}
                  {allProducts.length < 1 && (
                    <span className="text-xs text-muted-foreground flex justify-center items-center mt-2">
                      Buat produkmu agar bisa ditautkan
                    </span>
                  )}
                  {selectedProductId && (
                    <div className="flex gap-2 w-full bg-accent p-2 rounded-md">
                      <Label className="truncate flex-1 px-1 max-w-full">
                        {filteredProduct[0].name.slice(0, 20)}
                        {filteredProduct[0].name.length > 20 && "..."}
                      </Label>
                      <Button
                        type="button"
                        onClick={handleClearSelectedProduct}
                        variant={"destructive"}
                      >
                        x
                      </Button>
                    </div>
                  )}
                </Field>
              )}
            />
            <Button disabled={isFormBusy} className="w-full">
              Posting Feed
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddFeedForm;
