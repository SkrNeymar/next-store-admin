import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productId } = await req.json()

  if (!params.storeId) {
    return new NextResponse("Store ID is required", { status: 400 })
  }

  if (!productId || productId.length === 0) {
    return new NextResponse("Product ID is required", { status: 400 })
  }

  const products = await prismadb.variant.findMany({
    where: {
      isArchived: false,
      id: {
        in: productId,
      },
    },
    include: {
      product: true,
    },
  })

  if (products.length === 0) {
    return new NextResponse("Product not found", { status: 400 })
  }

  const outOfStockProductIds = products
    .filter((item) => item.quantity === 0)
    .map((item) => item.id)

  if (outOfStockProductIds.length > 0) {
    return new NextResponse(
      JSON.stringify({
        error: "Out of stock",
        outOfStockProductIds: outOfStockProductIds,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  products.forEach((item) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "AUD",
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price.toNumber() * 100,
      },
    })
  })

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productId.map((productId: string) => ({
          variant: {
            connect: { id: productId },
          },
          quantity: 1,
        })),
      },
    },
  })

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  })

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  )
}
