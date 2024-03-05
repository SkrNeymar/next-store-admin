"use client"
import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form"
import { Trash } from "lucide-react"
import { Category, Color, Image, Product, Size, Variant } from "@prisma/client"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ImageUpload from "@/components/ui/image-upload"
import { AlertModal } from "@/components/modals/alertModal"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type FormValues = {
  variants: {
    sizeId: string
    colorId: string
    quantity: number
  }[]
}

interface ProductFormProps {
  initialData: Variant[]
  colors: Color[]
  sizes: Size[]
}

const formSchema = z.object({
  variants: z.array(
    z.object({
      sizeId: z.string().min(1, "Size is required"),
      colorId: z.string().min(1, "Color is required"),
      quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
    })
  ),
})

type ProductFormValues = z.infer<typeof formSchema>

const VariantsForm: React.FC<ProductFormProps> = ({
  initialData,
  colors,
  sizes,
}) => {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit variants" : "Create variants"
  const description = initialData
    ? "Add or Delete a variant"
    : "Add or Delete a variant"
  const toastSuccessMessage = initialData
    ? "Variants updated."
    : "Variants created."
  const actionLabel = initialData ? "Save changes" : "Create"

  const methods = useForm<FormValues>({
    defaultValues: {
      variants: [
        {
          sizeId: "",
          colorId: "",
          quantity: 1,
        },
      ],
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  })

  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control: methods.control,
  })

  // const onSubmit = async (values: ProductFormValues) => {
  //   try {
  //     setLoading(true)
  //     if (initialData) {
  //       await axios.patch(
  //         `/api/${params.storeId}/products/${params.productId}`,
  //         values
  //       )
  //     } else {
  //       await axios.post(`/api/${params.storeId}/products`, values)
  //     }
  //     router.refresh()
  //     router.push(`/${params.storeId}/products`)
  //     toast.success(toastSuccessMessage)
  //   } catch (error) {
  //     toast.error("Something went wrong.")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const onSubmit = (data: FormValues) => console.log(data)

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success("Product deleted.")
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 gap-8">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-8"
              >
                <FormField
                  control={methods.control}
                  name={`variants.${index}.sizeId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Controller
                        {...field}
                        render={({ field: controllerField }) => (
                          <Select
                            {...field}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a size" />
                            </SelectTrigger>
                            <SelectContent>
                              {sizes.map((size) => (
                                <SelectItem key={size.id} value={size.id}>
                                  {size.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name={`variants.${index}.colorId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Controller
                        {...field}
                        render={({ field: controllerField }) => (
                          <Select
                            {...field}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a size" />
                            </SelectTrigger>
                            <SelectContent>
                              {colors.map((color) => (
                                <SelectItem key={color.id} value={color.id}>
                                  {color.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name={`variants.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <Input {...field} type="number" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-start items-end">
                  <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-x-5">
            <Button
              onClick={() =>
                append({
                  sizeId: "",
                  colorId: "",
                  quantity: 1,
                })
              }
              variant="secondary"
            >
              Add Variant
            </Button>
            <Button disabled={loading} type="submit">
              {actionLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default VariantsForm
