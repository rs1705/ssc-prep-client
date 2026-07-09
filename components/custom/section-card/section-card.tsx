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
import { useRouter } from "next/navigation";

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  linkTo,
  buttonText,
  knowMoreText,
  icon,
}: SectionCardProps) => {
  const router = useRouter();
  const isClickable = linkTo !== "#";

  const handleCardClick = () => {
    if (isClickable) {
      router.push(linkTo);
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={`group shadow-sm hover:shadow-md transition-all duration-300 w-full h-full flex flex-col border-border rounded-[18px] overflow-hidden select-none ${
        isClickable ? "hover:border-primary/30 cursor-pointer" : "opacity-80"
      }`}
    >
      <CardHeader>
        {icon && (
          <div className="text-3xl mb-2 transition-transform duration-300 origin-left group-hover:scale-125">
            {icon}
          </div>
        )}
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{description}</p>
        {knowMoreText && (
          <div className="mt-4">
            <InfoDialog description={knowMoreText} title={title} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href={linkTo}
          className="flex w-full items-center justify-center"
        >
          <Button 
            variant={linkTo === "#" ? "outline" : "default"} 
            disabled={linkTo === "#"} 
            className="w-full justify-center cursor-pointer gap-2 group rounded-[12px] h-10"
          >
            {linkTo !== "#" && <Play className="w-4 h-4 transition-transform group-hover:scale-110" />}
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SectionCard;
