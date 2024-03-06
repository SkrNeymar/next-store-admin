import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(
  req: Request,
  { params }: { params: { variantId: string } }
) {
  try {
    if (!params.variantId) {
      return new NextResponse("Variant id is required", { status: 400 })
    }

    const product = await prismadb.variant.findUnique({
      where: {
        id: params.variantId,
      },
      include: {
        size: true,
        color: true,
        product: {
          include: {
            images: true,
          },
        },
      },
    })

    return NextResponse.json(product, {
      headers: corsHeaders,
    })
  } catch (error) {
    console.log("[VARIANT GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
