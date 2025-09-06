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
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { SectionCardProps } from "@/lib/types";
import InfoDialog from "../info-dialog";

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  linkTo,
  buttonText,
  knowMoreText,
}: SectionCardProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-500">{description}</p>
        {knowMoreText && (
          <InfoDialog description={knowMoreText} title={title} />
        )}
      </CardContent>
      <CardFooter>
        <Link
          href={linkTo}
          className="flex w-full items-center justify-center gap-2"
        >
          {" "}
          <Button className="w-full justify-center cursor-pointer">
            <Play />
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SectionCard;
