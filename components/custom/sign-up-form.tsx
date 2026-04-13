"use client";
import React from "react";
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
import { CircleUserRound } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.email(),
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
    <div>
      <div>
        <div className="flex justify-center">
          <CircleUserRound size={80} />
        </div>
        <h2 className="font-bold text-4xl">Sign up</h2>
        <p className="text-slate-500">
          Please enter your details to sign up for SSC Prep
        </p>
        <br />
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Name</FormLabel>
                  <p className="text-left text-sm text-red-600 font-semibold">
                    {form.formState.errors.username?.message}
                  </p>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Email</FormLabel>
                  <p className="text-left text-sm text-red-600 font-semibold">
                    {form.formState.errors.email?.message}
                  </p>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Password</FormLabel>
                  <p className="text-left text-sm text-red-600 font-semibold">
                    {form.formState.errors.password?.message}
                  </p>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>

            <div className="flex justify-center">
              <Button type="submit" className="hover:cursor-pointer w-full">
                Sign up
              </Button>
            </div>

            <div>
              <p className="text-md">
                Already have an account?&nbsp;
                <Link href="/signin" className="font-semibold underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForm;
