"use client";

import React from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Login details:", values);
    router.push("/dashboard");
  };
  return (
    <div className="w-full">
      <div className="text-center mb-4 sm:mb-5">
        <div className="flex justify-center mb-2.5 sm:mb-3 scale-95 sm:scale-100">
          <Logo />
        </div>
        <h2 className="font-extrabold text-xl sm:text-2xl tracking-tight mb-1 text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Enter your credentials to access your dashboard
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    className="h-12 rounded-2xl bg-card/60 backdrop-blur-md border-2 border-border/60 hover:border-border focus-visible:bg-card focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/20 transition-all text-sm px-4"
                    {...field}
                  />
                </FormControl>
                <p className="text-left text-xs text-rose-500 font-medium">
                  {form.formState.errors.email?.message}
                </p>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Password</FormLabel>
                  <Link href="#" className="text-xs font-mono font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 rounded-2xl bg-card/60 backdrop-blur-md border-2 border-border/60 hover:border-border focus-visible:bg-card focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/20 transition-all text-sm px-4"
                    {...field}
                  />
                </FormControl>
                <p className="text-left text-xs text-rose-500 font-medium">
                  {form.formState.errors.password?.message}
                </p>
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button type="submit" className="w-full h-12 px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 hover:cursor-pointer flex items-center justify-center border-0 group">
              <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
