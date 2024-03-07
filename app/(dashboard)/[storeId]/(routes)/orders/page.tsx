import { format } from "date-fns"
import prismadb from "@/lib/prismadb"
import { OrderClient } from "./components/OrderClient"
import { OrderColumn } from "./components/columns"
import { formatter } from "@/lib/utils"

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              product: true,
              size: true,
              color: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    isPaid: order.isPaid.toString(),
    products: order.orderItems
      .map(
        (orderItem) =>
          `${orderItem.variant.product.name}, ${orderItem.variant.size.name}, ${orderItem.variant.color.name} x ${orderItem.quantity}`
      )
      .join(", "),
    totalPrice: formatter.format(
      order.orderItems.reduce((total, item) => {
        return total + Number(item.variant.product.price)
      }, 0)
    ),
    createdAt: format(order.createdAt, "HH:mm:ss MMM do yyyy"),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage
