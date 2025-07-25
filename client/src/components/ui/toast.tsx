"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../../components/ui/toast";
import { create } from "@radix-ui/react-toast";
import * as React from "react";

const Toaster = ({ ...props }) => {
  return (
    <ToastProvider {...props}>
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-96 max-w-full z-[100]" />
    </ToastProvider>
  );
};

function useToast() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const toast = ({ title, description }: { title: string; description?: string }) => {
    setTitle(title);
    setDescription(description || "");
    setOpen(true);
  };

  const ToastComponent = (
    <Toast open={open} onOpenChange={setOpen}>
      <ToastTitle>{title}</ToastTitle>
      {description && <ToastDescription>{description}</ToastDescription>}
      <ToastClose />
    </Toast>
  );

  return {
    toast,
    Toaster: () => (
      <Toaster>
        {ToastComponent}
      </Toaster>
    ),
  };
}

export { useToast };