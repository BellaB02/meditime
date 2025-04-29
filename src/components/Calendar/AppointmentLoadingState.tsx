
import { Skeleton } from "@/components/ui/skeleton";

export const AppointmentLoadingState = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full h-32" />
      ))}
    </div>
  );
};
