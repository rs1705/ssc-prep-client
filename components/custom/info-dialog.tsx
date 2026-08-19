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
          className="p-0 h-auto text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-0.5 hover:cursor-pointer"
        >
          <span>Know more</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent 
        className="relative rounded-3xl w-[calc(100%-2rem)] sm:max-w-md border-2 border-border/80 p-6 bg-background/95 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
      >
        <AlertDialogCancel asChild>
          <button
            className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted border-2 border-border/40 active:scale-95 transition-all cursor-pointer shrink-0 z-10"
            title="Close"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </AlertDialogCancel>
        <AlertDialogHeader className="pb-3 border-b-2 border-border/40 flex flex-col items-start text-left space-y-1">
          <AlertDialogTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground w-full mt-2">
            <HelpCircle className="w-5 h-5 text-primary shrink-0" />
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription asChild className="text-sm text-muted-foreground leading-relaxed mt-4 text-left w-full">
          <div className="space-y-3.5 mt-2">
            {description.split("\n\n").map((para, i) => {
              const isList = para.match(/^\d+\./) || para.startsWith("▪️") || para.startsWith("Best For:");
              return (
                <p 
                  key={i} 
                  className={`text-muted-foreground ${
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
          <AlertDialogAction className="h-11 rounded-2xl px-6 font-bold bg-primary text-primary-foreground active:scale-[0.98] transition-transform shadow-sm hover:opacity-95 w-full sm:w-auto">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InfoDialog;
