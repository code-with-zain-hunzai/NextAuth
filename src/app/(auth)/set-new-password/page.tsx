'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from 'next/navigation';

const ResetPasswordPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ password: string; confirmPassword: string }>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: values.password }),
    });

    const result = await response.json();

    if (result.success) {
      toast({
        title: 'Password Reset',
        description: 'Your password has been updated successfully.',
        variant: 'default',
      });
      router.push('/sign-in');
    } else {
      toast({
        title: 'Error',
        description: 'Something went wrong!',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center">Set New Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <Input
          type="password"
          placeholder="Enter new password"
          {...register('password', { required: true })}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          {...register('confirmPassword', { required: true })}
        />
        {errors.password && <p className="text-red-500">Password is required</p>}
        {errors.confirmPassword && <p className="text-red-500">Confirm password is required</p>}
        <Button type="submit" className="w-full">Save New Password</Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
