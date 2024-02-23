"use client"
import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Trash } from "lucide-react"
import { Category, Color, Size, Variant } from "@prisma/client"
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

interface VariantsFormProps {
  initialData: Variant[]
  colors: Color[]
  sizes: Size[]
}

const formSchema = z.object({
  productId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  quantity: z.number().min(1),
})

const VariantsArraySchema = z.array(formSchema)
type VariantsFormValues = z.infer<typeof VariantsArraySchema>

const VariantsForm: React.FC<VariantsFormProps> = ({
  initialData,
  colors,
  sizes,
}) => {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [variants, setVariants] = useState<Variant[]>(
    initialData || [
      {
        productId: params.productId || "",
        sizeId: "",
        colorId: "",
        quantity: 1,
      },
    ]
  )

  const title = initialData ? "Edit variant" : "Create variant"
  const description = initialData ? "Edit a variant" : "Add a variant"
  const toastSuccessMessage = initialData
    ? "Product updated."
    : "Product created."
  const actionLabel = initialData ? "Save changes" : "Create"

  const form = useForm<VariantsFormValues>({
    resolver: zodResolver(VariantsArraySchema),
    defaultValues: initialData || [
      {
        productId: params.productId || "",
        sizeId: "",
        colorId: "",
        quantity: 1,
      },
    ],
  })

  const onSubmit = async (values: VariantsFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/variants/${params.variantId}`,
          values
        )
      } else {
        await axios.post(`/api/${params.storeId}/variants`, values)
      }
      router.refresh()
      router.push(`/${params.storeId}/variants`)
      toast.success(toastSuccessMessage)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/variants/${params.variantId}`)
      router.refresh()
      router.push(`/${params.storeId}/variants`)
      toast.success("Product deleted.")
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: "",
        productId: params.productId,
        sizeId: "",
        colorId: "",
        quantity: 1,
      },
    ])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
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
        {/* Hide delete button when create new variant */}
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 gap-8">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-8"
              >
                <FormField
                  control={form.control}
                  name="sizeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a size"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sizes.map((size) => (
                            <SelectItem key={size.id} value={size.id}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a color"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.id} value={color.id}>
                              {color.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="1"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-start items-end">
                  <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div></div>
          </div>
          <div className="flex gap-x-5">
            <Button onClick={addVariant} variant="secondary">
              Add Variant
            </Button>
            <Button disabled={loading} type="submit">
              {actionLabel}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default VariantsForm
