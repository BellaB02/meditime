
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  pulse?: boolean;
}

function Skeleton({
  className,
  pulse = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted", 
        pulse && "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
