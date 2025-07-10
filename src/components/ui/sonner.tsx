import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      closeButton
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-2xl border-2 border-orange-200 bg-white/90 shadow-[4px_4px_0px_0px_#fbbf24] px-6 py-4 text-gray-900 font-semibold transition-all group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
          description: "text-base text-gray-700 font-normal",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-50 group-[.toast]:to-purple-50 group-[.toast]:hover:from-blue-100 group-[.toast]:hover:to-purple-100 group-[.toast]:text-blue-700 group-[.toast]:hover:text-blue-800 group-[.toast]:border group-[.toast]:border-blue-200 group-[.toast]:hover:border-blue-300 group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:font-medium group-[.toast]:rounded-md dark:group-[.toast]:from-blue-900/20 dark:group-[.toast]:to-purple-900/20 dark:group-[.toast]:hover:from-blue-800/30 dark:group-[.toast]:hover:to-purple-800/30 dark:group-[.toast]:text-blue-300 dark:group-[.toast]:hover:text-blue-200 dark:group-[.toast]:border-blue-700 dark:group-[.toast]:hover:border-blue-600",
          closeButton:
            "group-[.toast]:absolute group-[.toast]:right-2 group-[.toast]:top-2 text-orange-500 hover:text-pink-500 border border-orange-200 hover:border-pink-200 rounded-xl p-1 ml-auto flex-shrink-0 shadow-none transition group-[.toast]:scale-110 group-[.toast]:font-semibold",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
