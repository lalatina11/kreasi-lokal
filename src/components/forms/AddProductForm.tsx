import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, SwitchCamera, Trash } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { ScrollArea } from "../ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, CreateProductSchemaType } from "@/lib/formSchema";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAllCategories } from "@/server/renders/category";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { createProductForMerchant } from "@/server/actions/products";
import { useRouter } from "@tanstack/react-router";

const AddProductForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <section>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>
            <Plus /> Tambah Produk baru
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Tambahkan Produk</SheetTitle>
            <SheetDescription>
              Tambahkan produk baru ke katalog anda
            </SheetDescription>
          </SheetHeader>
          <ProductForm handleCloseSheet={handleClose} isSheetOpen={isOpen} />
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleClose} variant="outline">
                Batal
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default AddProductForm;

export const ProductForm = ({
  handleCloseSheet,
  isSheetOpen,
}: {
  handleCloseSheet: () => void;
  isSheetOpen: boolean;
}) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      fullDescription: "",
      categoryId: "",
      image: undefined,
      isStockReady: true,
      price: 0,
      type: "goods",
    },
  });

  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const handleGetCategories = useServerFn(getAllCategories);
  const onSubmit = async (values: CreateProductSchemaType) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        data.append(key, value.toString());
      }
    });
    const { error, message, id } = await createProductForMerchant({ data });
    if (error) {
      form.setError("root", { message });
      toast.error("Gagal menambahkan produk", {
        description: message,
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
    } else {
      form.clearErrors();
      toast.success("Berhasil menambahkan produk", {
        action: {
          label: "OK",
          onClick: async () => {
            await router.navigate({ to: "/products/$id", params: { id } });
          },
        },
      });
      handleCloseSheet();
      router.invalidate();
    }
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await handleGetCategories(),
    enabled: isSheetOpen,
  });

  const productType = ["goods", "services", "goods_and_services"] as Array<
    CreateProductSchemaType["type"]
  >;

  const switchProductTypeName = (type: CreateProductSchemaType["type"]) => {
    switch (type) {
      case "goods":
        return "barang";
      case "services":
        return "jasa";
      default:
        return "barang dan jasa";
    }
  };

  const handleClearImage = () => {
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    setImagePreviewUrl("");
  };

  return (
    <ScrollArea className="p-5 overflow-y-auto scrollbarHide">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {form.formState.errors.root && (
          <FieldError
            className="my-2 text-xs"
            errors={[form.formState.errors.root]}
          />
        )}
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nama Produk</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Batik mega mendung"
                  autoComplete="off"
                />
                <FieldDescription className="text-xs">
                  Nama Produk wajib diisi
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="shortDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Deskripsi Singkat</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id={field.name}
                    placeholder="Batik mega mendung kualitas terbaik"
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/128 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription className="text-xs">
                  Deskripsi Singkat Wajib diisi
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="fullDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Deksripsi Lengkap</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id={field.name}
                    placeholder="lorem ipsum"
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {(field.value as string).length}/255 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription className="text-xs">
                  Deskripsi Lengkap boleh kosong
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Harga (Rp)</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    placeholder="lorem ipsum"
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                    value={Number(form.watch().price).toString()}
                    onChange={(e) =>
                      form.setValue("price", Number(e.target.value))
                    }
                    autoComplete="off"
                  />
                </InputGroup>
                <FieldDescription className="text-xs">
                  Harga dengan nominal rupiah
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Gambar</FieldLabel>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id={field.name}
                  ref={imageRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      form.setValue("image", file);
                      const imageUrl = URL.createObjectURL(file);
                      setImagePreviewUrl(imageUrl);
                    } else {
                      form.setValue("image", undefined);
                      if (imageRef.current) {
                        imageRef.current.value = "";
                      }
                      setImagePreviewUrl("");
                    }
                  }}
                />
                {imagePreviewUrl && (
                  <img
                    className="w-full h-auto object-cover rounded-md"
                    src={imagePreviewUrl}
                  />
                )}
                {imagePreviewUrl ? (
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      htmlFor={field.name}
                      className={"" + buttonVariants({ variant: "outline" })}
                    >
                      <SwitchCamera />
                      Ganti Gambar
                    </label>
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={handleClearImage}
                    >
                      <Trash />
                      Hapus Gambar
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor={field.name}
                    className={"" + buttonVariants({ variant: "outline" })}
                  >
                    <Plus />
                    Masukkan Gambar
                  </label>
                )}
                <FieldDescription className="text-xs">
                  Gambar boleh kosong
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tipe Produk</FieldLabel>
                <Select
                  defaultValue={form.getValues().type}
                  onValueChange={(val: CreateProductSchemaType["type"]) =>
                    form.setValue("type", val)
                  }
                >
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Pilih Tipe Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Pilih Tipe Produk</SelectLabel>
                      {productType.map((type) => (
                        <SelectItem
                          className="capitalize"
                          key={type}
                          value={type}
                        >
                          {switchProductTypeName(type)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {categories && (
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Pilih Kategori</FieldLabel>
                  <Select
                    onValueChange={(val) => form.setValue("categoryId", val)}
                  >
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue
                        className="capitalize"
                        placeholder="Pilih Kategori"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Kategori</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem
                            className="capitalize"
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription className="text-xs">
                    Kategori wajib diisi
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            name="isStockReady"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldGroup className="flex gap-2 flex-row items-center">
                  <Checkbox
                    checked={form.getValues().isStockReady}
                    onCheckedChange={(check) =>
                      form.setValue("isStockReady", !!check)
                    }
                    id={field.name}
                  />
                  <FieldLabel htmlFor={field.name}>Stok Tersedia</FieldLabel>
                </FieldGroup>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup className="my-3">
          <Button>Tambahkan</Button>
        </FieldGroup>
      </form>
    </ScrollArea>
  );
};
