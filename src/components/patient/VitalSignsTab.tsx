
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Thermometer, Heart, Activity } from "lucide-react";
import { VitalSign } from "@/services/PatientService";

type VitalSignsTabProps = {
  vitalSigns: VitalSign[];
};

const VitalSignsTab: React.FC<VitalSignsTabProps> = ({ vitalSigns }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Suivi des constantes</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter mesure
        </Button>
      </CardHeader>
      <CardContent>
        {vitalSigns.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Thermometer size={14} /> Température
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Heart size={14} /> Pouls
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Activity size={14} /> Tension
                  </div>
                </TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vitalSigns.map((sign, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{sign.date}</TableCell>
                  <TableCell>{sign.temperature}</TableCell>
                  <TableCell>{sign.heartRate}</TableCell>
                  <TableCell>{sign.bloodPressure}</TableCell>
                  <TableCell>{sign.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucune constante enregistrée pour ce patient
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalSignsTab;
