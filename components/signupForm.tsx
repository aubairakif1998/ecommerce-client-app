'use client'

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast, useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ApiResponse } from '@/Interfaces/ApiResponse';

// Updated validation schema
const AccessTypeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    phone: z.string().regex(/^(\+92|0)?[3][0-9]{9}$/, 'Invalid phone number'), // Regex for Pakistani mobile numbers
    deliveryLocation: z.string().min(1, 'Delivery location is required'),
});
type Inputs = z.infer<typeof AccessTypeSchema>;

export default function StaffRegistrationForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(AccessTypeSchema),
    });

    const processForm: SubmitHandler<Inputs> = async data => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast({
                title: 'Success',
                description: response.data.message,
            });
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error during admin store registration:', error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? 'There was a problem with the registration. Please try again.';
            toast({
                title: 'Registration Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        router.replace('/sign-in');
    };

    return (
        <section className='absolute inset-0 flex flex-col justify-center items-center p-14 bg-gray-900'>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white lg:text-5xl mb-16">
                    Ecommerce Admin Portal Registration
                </h1>
            </div>

            <form className='w-full max-w-md' onSubmit={handleSubmit(processForm)}>
                {/* Name Field */}
                <div className='mb-4'>
                    <label
                        htmlFor='name'
                        className='block text-sm font-medium leading-6 text-gray-200'
                    >
                        Name
                    </label>
                    <div className='mt-2'>
                        <input
                            id='name'
                            type='text'
                            {...register('name')}
                            className='bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                        />
                        {errors.name?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email Field */}
                <div className='mb-4'>
                    <label
                        htmlFor='email'
                        className='block text-sm font-medium leading-6 text-gray-200'
                    >
                        Email address
                    </label>
                    <div className='mt-2'>
                        <input
                            id='email'
                            type='email'
                            {...register('email')}
                            autoComplete='email'
                            className='bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                        />
                        {errors.email?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Password Field */}
                <div className='mb-4'>
                    <label
                        htmlFor='password'
                        className='block text-sm font-medium leading-6 text-gray-200'
                    >
                        Password
                    </label>
                    <div className='mt-2'>
                        <input
                            id='password'
                            type='password'
                            {...register('password')}
                            autoComplete='new-password'
                            className='bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                        />
                        {errors.password?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Phone Number Field */}
                <div className='mb-4'>
                    <label
                        htmlFor='phone'
                        className='block text-sm font-medium leading-6 text-gray-200'
                    >
                        Phone Number
                    </label>
                    <div className='mt-2'>
                        <input
                            id='phone'
                            type='text'
                            {...register('phone')}
                            className='bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                        />
                        {errors.phone?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.phone.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Delivery Location Field */}
                <div className='mb-4'>
                    <label
                        htmlFor='deliveryLocation'
                        className='block text-sm font-medium leading-6 text-gray-200'
                    >
                        Delivery Location
                    </label>
                    <div className='mt-2'>
                        <input
                            id='deliveryLocation'
                            type='text'
                            {...register('deliveryLocation')}
                            className='bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                        />
                        {errors.deliveryLocation?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.deliveryLocation.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : ''} transition duration-300 ease-in-out`}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit'}
                    </Button>
                </div>
            </form>

            {isDialogOpen && (
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Registration Successful</AlertDialogTitle>
                            <AlertDialogDescription>
                                <p className='mb-4'>Your registration was successful.</p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button onClick={handleCloseDialog}>
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </section>
    );
}
