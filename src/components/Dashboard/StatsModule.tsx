
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookUser, Calendar, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";

const patientData = [
  { month: 'Jan', actifs: 20, nouveaux: 5 },
  { month: 'Fév', actifs: 25, nouveaux: 8 },
  { month: 'Mar', actifs: 30, nouveaux: 12 },
  { month: 'Avr', actifs: 28, nouveaux: 6 },
  { month: 'Mai', actifs: 32, nouveaux: 10 },
  { month: 'Juin', actifs: 35, nouveaux: 7 },
];

const appointmentData = [
  { day: 'Lun', réalisés: 8, planifiés: 10 },
  { day: 'Mar', réalisés: 12, planifiés: 15 },
  { day: 'Mer', réalisés: 10, planifiés: 11 },
  { day: 'Jeu', réalisés: 15, planifiés: 15 },
  { day: 'Ven', réalisés: 9, planifiés: 12 },
  { day: 'Sam', réalisés: 5, planifiés: 6 },
  { day: 'Dim', réalisés: 3, planifiés: 3 },
];

const invoiceData = [
  { month: 'Jan', montant: 1200 },
  { month: 'Fév', montant: 1500 },
  { month: 'Mar', montant: 1800 },
  { month: 'Avr', montant: 1600 },
  { month: 'Mai', montant: 2100 },
  { month: 'Juin', montant: 2400 },
];

// Données cumulatives pour le graphique de zone
const growthData = [
  { month: 'Jan', patients: 20 },
  { month: 'Fév', patients: 45 },
  { month: 'Mar', patients: 75 },
  { month: 'Avr', patients: 103 },
  { month: 'Mai', patients: 135 },
  { month: 'Juin', patients: 170 },
];

// Composant de tuile statistique
interface StatTileProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
}

const StatTile: React.FC<StatTileProps> = ({ title, value, icon, change, isPositive = true }) => {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-1 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {change} {isPositive ? 'augmentation' : 'diminution'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Types de graphiques
type ChartType = "bar" | "area";

// Composant principal
const StatsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Statistiques</h2>
      
      {/* Grid de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile 
          title="Patients actifs" 
          value="170"
          icon={<Users size={18} />} 
          change="12%" 
          isPositive={true}
        />
        <StatTile 
          title="Rendez-vous ce mois" 
          value="216" 
          icon={<Calendar size={18} />}
          change="8%" 
          isPositive={true}
        />
        <StatTile 
          title="Taux de complétion" 
          value="94%" 
          icon={<CheckCircle size={18} />}
          change="3%" 
          isPositive={true}
        />
        <StatTile 
          title="Chiffre d'affaires" 
          value="2400 €" 
          icon={<TrendingUp size={18} />}
          change="15%" 
          isPositive={true}
        />
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <BookUser className="mr-2 h-4 w-4 text-primary" />
              Évolution des patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={patientData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="actifs" name="Patients actifs" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nouveaux" name="Nouveaux patients" fill="#D6BCFA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Graphique de rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Rendez-vous hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={appointmentData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="réalisés" name="RDV réalisés" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="planifiés" name="RDV planifiés" fill="#D6BCFA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Graphique de facturation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <TrendingUp className="mr-2 h-4 w-4 text-primary" />
              Facturation mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={invoiceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} €`, 'Montant']} />
                <Bar dataKey="montant" name="Montant" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Graphique de croissance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base font-medium">
              <Users className="mr-2 h-4 w-4 text-primary" />
              Croissance de la patientèle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Patients cumulés']} />
                <Area type="monotone" dataKey="patients" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsModule;
