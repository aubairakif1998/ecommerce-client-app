import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust the import based on your auth setup

const OrdersPage = async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
        // Handle the case where there is no user/session
        return <div>Please sign in to view your orders.</div>;
    }

    // Fetching orders based on storeId and user.id
    const orders = await prismadb.order.findMany({
        where: {
            AND: [
                { storeId: process.env.STORE_ID },
                { commonUserId: user._id } // Ensure to use user.id to filter by the logged-in user
            ],
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const formattedOrders: OrderColumn[] = orders.map((item: any) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems
            .map((orderItem: { product: { name: any } }) => orderItem.product.name)
            .join(", "),
        totalPrice: formatter.format(
            item.orderItems.reduce(
                (total: number, orderItem: { product: { price: any } }) => {
                    return total + Number(orderItem.product.price);
                },
                0
            )
        ),
        status: item.status,
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;
