import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";

interface InfoDialogProps {
  title: string;
  description: string;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ title, description }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto text-xs font-bold text-primary hover:text-indigo-600 transition-colors flex items-center gap-0.5 hover:cursor-pointer"
        >
          <span>Know more</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent 
        className="relative rounded-3xl w-[calc(100%-2rem)] sm:max-w-md border border-border p-6 bg-background shadow-md"
      >
        <AlertDialogCancel asChild>
          <button className="absolute right-4 top-4 rounded-full w-8 h-8 p-0 flex items-center justify-center border-none bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground hover:cursor-pointer transition-colors outline-none focus-visible:ring-0">
            <X className="w-4 h-4" />
          </button>
        </AlertDialogCancel>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
            <div className="space-y-3">
              {description.split("\n\n").map((para, i) => (
                <p key={i}>
                  {para}
                </p>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 sm:justify-end">
          <AlertDialogAction className="h-11 rounded-2xl px-6 font-bold bg-gradient-to-r from-primary to-indigo-600 text-white active:scale-[0.98] transition-transform shadow-sm hover:opacity-95 hover:cursor-pointer w-full sm:w-auto">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InfoDialog;
