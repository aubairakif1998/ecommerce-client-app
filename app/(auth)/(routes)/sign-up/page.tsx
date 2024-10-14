'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { signUpSchema } from '@/schemas/signUpSchema';

// Define the sign-up schema

export default function SignUpForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const { toast } = useToast();

    const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async data => {
        setLoading(true);
        try {
            const response = await axios.post('/api/sign-up', data);
            toast({
                title: 'Success',
                description: response.data.message,
            });
            router.replace('/sign-in');
        } catch (error) {
            console.error('Error during registration:', error);
            const axiosError = error as AxiosError;
            const errorMessage: any = axiosError.response?.data || 'There was a problem with the registration. Please try again.'
            toast({
                title: 'Registration Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-[550px] bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="email"
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
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : 'Sign Up'}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Already a member?<span> </span>
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 transition duration-200">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
