import { authOptions } from '@/lib/auth';
import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const _user = session?.user;

        if (!session || !_user) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        const existingOrders = await prismadb.order.findMany({
            where: {
                commonUserId: _user._id,
                storeId: process.env.STORE_ID
            }
        });
        console.log("existingOrders", existingOrders)

        return new Response(JSON.stringify({
            success: true,
            orders: existingOrders
        }), { status: 200 });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error fetching orders' }), { status: 500 });
    }
}
