import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: { storeid: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const _user = session?.user;

        if (!session || !_user) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        const { productIds } = await req.json();
        if (!productIds || productIds.length === 0) {
            return new NextResponse("Product ids are required", { status: 400 });
        }
        if (!_user._id) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Fetch products that are available and not archived
        const products = await prismadb.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
                isArchived: false, // Ensure products are not archived
            },
        });

        // Check if all requested products are available
        if (products.length !== productIds.length) {
            return new NextResponse("Some products are not available or are archived", { status: 404 });
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map((product: any) => ({
            quantity: 1,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price * 100,
            },
        }));

        // Create an order in the database
        const order = await prismadb.order.create({
            data: {
                storeId: process.env.STORE_ID ?? "",
                isPaid: false,
                phone: "",
                address: "",
                status: "Pending", // Set the initial status
                orderItems: {
                    create: productIds.map((productId: string) => ({
                        product: {
                            connect: {
                                id: productId,
                            },
                        },
                    })),
                },
                commonUserId: _user._id,
            },
        });

        const stripsession = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            billing_address_collection: 'required',
            phone_number_collection: {
                enabled: true,
            },
            success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
            cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
            metadata: {
                orderId: order.id,
                userId: _user._id,
            },
        });

        return NextResponse.json({ url: stripsession.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
