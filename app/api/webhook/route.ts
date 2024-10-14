import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const orderId = session?.metadata?.orderId;
        const order = await prismadb.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true }
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        const productIds = order.orderItems.map((orderItem: any) => orderItem.productId);

        // Check if products are still available
        const availableProducts = await prismadb.product.findMany({
            where: {
                id: { in: productIds },
                isArchived: false, // Ensure the product is not archived
            },
        });

        if (availableProducts.length !== productIds.length) {
            // If not all products are available, mark the order as canceled
            await prismadb.order.update({
                where: { id: orderId },
                data: {
                    status: "canceled",
                    isPaid: false,
                },
            });
            return new NextResponse(null, { status: 200 });
        }

        const address = session?.customer_details?.address;
        const addressComponents = [
            address?.line1,
            address?.line2,
            address?.city,
            address?.state,
            address?.postal_code,
            address?.country
        ];

        const addressString = addressComponents.filter((c) => c !== null).join(', ');

        // Update the order as paid and set address details
        await prismadb.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || '',
                commonUserId: session?.metadata?.userId,
                storeId: process.env.STORE_ID,
                status: "Pending",
            }
        });

        // Mark the products as archived after successful payment
        await prismadb.product.updateMany({
            where: { id: { in: productIds } },
            data: { isArchived: true }
        });
    }

    return new NextResponse(null, { status: 200 });
}
