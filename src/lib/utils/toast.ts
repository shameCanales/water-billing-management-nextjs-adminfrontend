import { toast } from "sonner";

interface ToastProps {
  title: string;
  message?: string;
  duration?: number;
}

export const notify = {
  // Simple success
  success: ({ title, message, duration }: ToastProps) => {
    toast.success(title, { description: message, duration });
  },

  // Simple error
  error: ({ title, message, duration }: ToastProps) => {
    toast.error(title, { description: message, duration });
  },

  // Simple warning
  warning: ({ title, message, duration }: ToastProps) => {
    toast.warning(title, { description: message, duration });
  },

  // Simple info
  info: ({ title, message, duration }: ToastProps) => {
    toast.info(title, { description: message, duration });
  },

  // Async Promise (Loading -> Success/Error automatically)
  // Very useful for API calls like "Updating Consumer..."
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};
