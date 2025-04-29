
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  pulse?: boolean;
  variant?: "default" | "card" | "avatar" | "button" | "input";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  pulse = true,
  variant = "default",
  width,
  height,
  ...props
}: SkeletonProps) {
  // Déterminer les classes en fonction de la variante
  const variantClasses = {
    default: "",
    card: "h-[180px] w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
    input: "h-10 w-full",
  };

  return (
    <div
      className={cn(
        "rounded-md bg-muted", 
        pulse && "animate-pulse",
        variantClasses[variant],
        className
      )}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      {...props}
    />
  )
}

export { Skeleton }
