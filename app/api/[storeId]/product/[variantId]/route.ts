import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET (
  req: Request,
  { params } : { params: {variantId: string } }
){
  try {
    if (!params.variantId) {
      return new NextResponse("Variant id is required", { status: 400 })
    }

    const product = await prismadb.variant.findUnique({
      where: {
        id: params.variantId,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(product)

  } catch (error) {
    console.log("[VARIANT GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}