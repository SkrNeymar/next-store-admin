import prismadb from "@/lib/prismadb"
import VariantsForm from "./components/VariantsForm"

const VariantsPage = async ({
  params,
}: {
  params: { productId: string; storeId: string }
}) => {
  const variants = await prismadb.variant.findMany({
    where: {
      productId: params.productId,
      isArchived: false,
    },
  })

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VariantsForm initialData={variants} sizes={sizes} colors={colors} />
      </div>
    </div>
  )
}

export default VariantsPage
