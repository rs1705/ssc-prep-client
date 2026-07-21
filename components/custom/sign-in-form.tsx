import React from "react";
import { LogIn } from "lucide-react";
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    className="h-11 sm:h-12 rounded-xl bg-muted/50 border-transparent hover:bg-muted focus-visible:bg-transparent focus-visible:border-primary transition-colors text-sm px-3.5"
                    {...field}
                  />
                </FormControl>
                <p className="text-left text-xs text-red-500 font-medium">
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
                  <FormLabel className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</FormLabel>
                  <Link href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="h-11 sm:h-12 rounded-xl bg-muted/50 border-transparent hover:bg-muted focus-visible:bg-transparent focus-visible:border-primary transition-colors text-sm px-3.5"
                    {...field}
                  />
                </FormControl>
                <p className="text-left text-xs text-red-500 font-medium">
                  {form.formState.errors.password?.message}
                </p>
              </FormItem>
            )}
          />
          <div className="pt-1.5">
            <Button type="submit" className="w-full h-11 sm:h-12 px-5 py-2.5 rounded-full text-[11px] font-extrabold tracking-widest uppercase gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 hover:cursor-pointer flex items-center justify-center border-0 group">
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
