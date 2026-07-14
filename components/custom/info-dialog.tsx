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
import { ChevronRight, X, HelpCircle } from "lucide-react";

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
        className="relative rounded-3xl w-[calc(100%-2rem)] sm:max-w-md border border-border/80 p-6 bg-background/95 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
      >
        <AlertDialogCancel asChild>
          <button className="absolute top-4 right-4 rounded-full h-8 w-8 flex items-center justify-center bg-accent/40 text-muted-foreground hover:text-foreground hover:bg-accent/85 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none shadow-sm cursor-pointer border-none outline-none">
            <X className="w-4 h-4" />
          </button>
        </AlertDialogCancel>
        <AlertDialogHeader className="pb-3 border-b border-border/40 flex flex-col items-start text-left space-y-1">
          <AlertDialogTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground w-full mt-2">
            <HelpCircle className="w-5 h-5 text-primary shrink-0" />
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription asChild className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-left w-full">
          <div className="space-y-3.5 mt-2">
            {description.split("\n\n").map((para, i) => {
              const isList = para.match(/^\d+\./) || para.startsWith("▪️") || para.startsWith("Best For:");
              return (
                <p 
                  key={i} 
                  className={`text-slate-600 dark:text-slate-300 ${
                    para.startsWith("Best For:") ? "font-bold text-foreground text-xs uppercase tracking-wider mt-4" : 
                    isList ? "text-sm font-medium pl-1 animate-in slide-in-from-left-2 duration-300" : "text-sm"
                  }`}
                >
                  {para}
                </p>
              );
            })}
          </div>
        </AlertDialogDescription>
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
