"use client"
import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form"
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
  initialData: Variant
  colors: Color[]
  sizes: Size[]
}

const formSchema = z.object({
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
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
  const description = initialData ? "Edit a variant" : "Add a variant"
  const toastSuccessMessage = initialData
    ? "Variants updated."
    : "Variants created."
  const actionLabel = initialData ? "Save changes" : "Create"

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      variants: [
        {
          sizeId: "",
          colorId: "",
          quantity: 1,
        },
      ],
    },
    mode: "onBlur",
  })
  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <section className={"section"} key={field.id}>
                <Controller
                  name={`variants.${index}.sizeId`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {"Select a size"}
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  name={`variants.${index}.colorId`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        {" "}
                        {/* Trigger to open select options */}
                        <SelectValue /> {/* Display selected value */}
                      </SelectTrigger>
                      <SelectContent>
                        {" "}
                        {/* Container for options */}
                        {colors.map((color) => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  disabled={loading}
                  placeholder="1"
                  type="number"
                  {...register(`variants.${index}.quantity` as const, {
                    valueAsNumber: true,
                    required: true,
                  })}
                />

                <button type="button" onClick={() => remove(index)}>
                  DELETE
                </button>
              </section>
            </div>
          )
        })}

        <button
          type="button"
          onClick={() =>
            append({
              sizeId: "",
              colorId: "",
              quantity: 1,
            })
          }
        >
          APPEND
        </button>
        <input type="submit" />
      </form>
    </>
  )
}

export default VariantsForm
