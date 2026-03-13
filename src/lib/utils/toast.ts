import { toast } from "sonner";

interface ToastProps {
  title: string;
  message?: string;
  duration?: number;
}

export const notify = {
  success: ({ title, message, duration = 4000 }: ToastProps) => {
    toast.success(title, { description: message, duration });
  },

  error: ({ title, message, duration = 5000 }: ToastProps) => {
    toast.error(title, { description: message, duration });
  },

  warning: ({ title, message, duration = 4000 }: ToastProps) => {
    toast.warning(title, { description: message, duration });
  },

  info: ({ title, message, duration = 4000 }: ToastProps) => {
    toast.info(title, { description: message, duration });
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};
