import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { variants } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!variants) {
      return new NextResponse("Variants are required", { status: 400 })
    }

    const existingVariants = await prismadb.variant.findMany({
      where: { productId: params.productId },
    })

    for (const variant of variants) {
      const existingVariant = existingVariants.find((v) => v.id === variant.id)

      if (existingVariant) {
        // Update existing variant
        await prismadb.variant.update({
          where: { id: variant.id },
          data: {
            sizeId: variant.sizeId,
            colorId: variant.colorId,
            quantity: variant.quantity,
          },
        })
      } else {
        // Create new variant
        await prismadb.variant.create({
          data: {
            productId: params.productId,
            sizeId: variant.sizeId,
            colorId: variant.colorId,
            quantity: variant.quantity,
          },
        })
      }
    }

    const variantIdsToUpdate = variants.map((v) => v.id)
    const variantIdsToDelete = existingVariants
      .filter((v) => !variantIdsToUpdate.includes(v.id))
      .map((v) => v.id)

    for (const variantId of variantIdsToDelete) {
      await prismadb.variant.update({
        where: { id: variantId },
        data: {
          isArchived: true,
        },
      })
    }

    // Send back the updated product with its variants
    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        variants: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[VARIANT PATCH]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 })
    }

    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        variants: true,
      },
    })

    return NextResponse.json(product?.variants)
  } catch (error) {
    console.error("[VARIANTS GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
