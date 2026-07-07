import React from "react";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Logo } from "./logo";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Email address invalid",
  }),
  password: z.string().min(6, {
    message: "Password should not be less than 6 characters",
  }),
});
type SignUpFormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6 scale-110">
          <Logo />
        </div>
        <h2 className="font-bold text-3xl tracking-tight mb-2 text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access your dashboard
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    className="h-12 rounded-lg"
                    {...field}
                  />
                </FormControl>
                <p className="text-left text-sm text-red-500 font-medium">
                  {form.formState.errors.email?.message}
                </p>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-semibold">Password</FormLabel>
                  <Link href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 rounded-lg"
                    {...field}
                  />
                </FormControl>
                <p className="text-left text-sm text-red-500 font-medium">
                  {form.formState.errors.password?.message}
                </p>
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button type="submit" className="w-full h-12 rounded-xl font-bold text-md">
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
