import { authOptions } from '@/lib/auth';
import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET(request: any) {
    try {
        const session = await getServerSession(authOptions);
        const _user = session?.user;

        if (!session || !_user) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
        }

        const existingOrders = await prismadb.order.findMany({
            where: {
                commonUserId: _user._id,
                storeId: process.env.STORE_ID
            }
        });

        return NextResponse.json({
            success: true,
            orders: existingOrders
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ success: false, message: 'Error fetching orders' }, { status: 500 });
    }
}
