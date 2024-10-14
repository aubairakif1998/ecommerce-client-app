'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignInForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });
    const { toast } = useToast();

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setLoading(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });
        setLoading(false);

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast({
                    title: 'Login Failed',
                    description: 'Incorrect credentials',
                    variant: 'destructive',
                    color: 'blue', // Change color to blue for error
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                    color: 'red',
                });
            }
        } else if (result?.url) {
            toast({
                title: 'Success',
                description: 'You have signed in successfully!',
                variant: 'default', // Adjust variant if needed
                color: 'blue', // Set toast color to blue for success
            });
            router.replace('/')
            router.refresh();
        }

    };

    return (
        <div className="flex justify-center items-center h-[550px] bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Email</FormLabel>
                                    <Input
                                        {...field}
                                        className="border-gray-300 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        placeholder="Enter your email"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        className="border-gray-300 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        placeholder="Enter your password"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition duration-200" type="submit" disabled={loading}>
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : 'Sign In'}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 transition duration-200">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
