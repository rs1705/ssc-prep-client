"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { SectionCardProps } from "@/lib/types";

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  linkTo,
  buttonText,
}: SectionCardProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-md text-slate-500">{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full justify-center">
          <Link
            href={linkTo}
            className="flex items-center justify-center gap-2"
          >
            <Play />
            {buttonText}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SectionCard;
