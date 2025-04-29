
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";

interface DailyCareProgressProps {
  completed?: number;
  total?: number;
  className?: string;
}

export const DailyCareProgress = ({ completed = 5, total = 8, className }: DailyCareProgressProps) => {
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock size={18} className="text-primary" />
          Progrès des soins du jour
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <Check size={16} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">{completed} sur {total} soins terminés</p>
                <p className="text-sm text-muted-foreground">
                  {progressPercentage}% de la tournée complétée
                </p>
              </div>
            </div>
            
            <div className="text-xl font-bold">
              {completed}/{total}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
