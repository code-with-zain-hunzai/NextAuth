'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ForgotPassword = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: { email: string }) => {
    try {
      const response = await axios.post('/api/auth/reset-password', values);

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'OTP has been sent to your email.',
          variant: 'default',
        });
        router.push('/otp-verification');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-semibold">Forgot Password</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <Input
          placeholder="Enter your email"
          {...form.register('email', { required: true })}
        />
        <Button type="submit" className="w-full">Send OTP</Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
