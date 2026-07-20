"use client";
import React from "react";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password should not be less than 6 characters",
  }),
});
type SignUpFormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
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
        <h2 className="font-bold text-3xl tracking-tight mb-2 text-foreground">Create an Account</h2>
        <p className="text-muted-foreground text-sm">
          Enter your details to get started with PrepPilot
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    className="h-12 rounded-lg"
                    {...field}
                  />
                </FormControl>
                <p className="text-left text-sm text-red-500 font-medium">
                  {form.formState.errors.username?.message}
                </p>
              </FormItem>
            )}
          />
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
                <FormLabel className="text-sm font-semibold">Password</FormLabel>
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
            <Button type="submit" className="w-full h-12 px-5 py-3 rounded-full text-[11px] font-extrabold tracking-widest uppercase gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 hover:cursor-pointer flex items-center justify-center border-0 group">
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Create Account
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
