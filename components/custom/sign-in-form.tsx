import React from "react";
import { useForm } from "react-hook-form";
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

type FormData = {
  email: string;
  password: string;
};

const SignInForm = () => {
  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormData) => {};
  return (
    <div>
      <div>
        <div className="flex justify-center">
          <CircleUserRound size={80} />
        </div>
        <h2 className="font-bold text-4xl">Login</h2>
        <p className="text-slate-500">
          Please enter your details to log in to SSC Prep
        </p>
        <br />
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Email</FormLabel>
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
            <div>
              <p>
                <Link href="" className="hover:underline">
                  Forgot password?
                </Link>
              </p>
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="hover:cursor-pointer w-full">
                Log In
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignInForm;
