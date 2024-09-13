'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from 'next/navigation';

const OtpVerification = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));

    const { handleSubmit } = useForm<{ otp: string }>({
        defaultValues: { otp: otp.join('') },
    });

    const handleOtpChange = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Handle backspace
        if (value === '') {
            if (index > 0) {
                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                prevInput?.focus();
            }
        } else if (index < 5 && value.length === 1) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            nextInput?.focus();
        }
    };

    const onSubmit = async () => {
        const otpValue = otp.join('');
        const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp: otpValue }),
        });

        if (res.ok) {
            toast({
                title: 'Success',
                description: 'OTP verified. Please set a new password.',
                variant: 'default',
            });
            router.push('/set-new-password');
        } else {
            toast({
                title: 'Error',
                description: 'Invalid OTP. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="max-w-md mx-auto ">
            <h1 className="text-xl font-bold text-center">OTP Verification</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 flex flex-col items-center">
                <div className='flex gap-2'>
                    {otp.map((value, index) => (
                        <Input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace') {
                                    handleOtpChange(index, '');
                                }
                            }}
                            className="w-12 text-center"
                            required
                        />
                    ))}
                </div>
                <div>
                    <Button type="submit" className="w-full mt-4">Verify OTP</Button>
                </div>
            </form>
        </div>
    );
};

export default OtpVerification;
