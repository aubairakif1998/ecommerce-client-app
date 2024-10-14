import prismadb from '@/lib/prismadb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const existingUser = await prismadb.commonUser.findFirst({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return new Response(JSON.stringify({ success: false, message: 'commonUser already exists with this email' }), { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prismadb.commonUser.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });
        return new Response(JSON.stringify({ success: true, message: 'commonUser registered successfully' }), { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error registering user' }), { status: 500 });
    }
}
