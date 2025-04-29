
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Chart } from "@/components/ui/chart";
import { 
  UserRound, 
  CalendarClock, 
  ActivitySquare, 
  BellRing,
  TrendingUp 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StatsData {
  totalPatients: number;
  activeAppointments: number;
  completedAppointments: number;
  unreadMessages: number;
  monthlyCareData: { date: string; count: number }[];
}

export function StatsModule() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData>({
    totalPatients: 0,
    activeAppointments: 0,
    completedAppointments: 0,
    unreadMessages: 0,
    monthlyCareData: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Récupérer le nombre total de patients
        const { count: patientCount } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true });
        
        // Récupérer le nombre de rendez-vous actifs
        const { count: activeAppCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'scheduled');
        
        // Récupérer le nombre de rendez-vous terminés
        const { count: completedAppCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');
        
        // Récupérer le nombre de messages non lus
        const { count: unreadMsgCount } = await supabase
          .from('patient_messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_from_patient', true)
          .is('read_at', null);
        
        // Récupérer les données de soins mensuels
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const { data: monthlyData } = await supabase
          .from('appointments')
          .select('date')
          .gte('date', sixMonthsAgo.toISOString().split('T')[0])
          .eq('status', 'completed');
          
        // Traiter les données mensuelles
        const monthlyCounts: Record<string, number> = {};
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        
        const now = new Date();
        for (let i = 0; i < 6; i++) {
          const d = new Date(now);
          d.setMonth(now.getMonth() - i);
          const monthKey = `${months[d.getMonth()]} ${d.getFullYear()}`;
          monthlyCounts[monthKey] = 0;
        }
        
        // Compter les rendez-vous par mois
        monthlyData?.forEach(app => {
          const date = new Date(app.date);
          const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
          if (monthKey in monthlyCounts) {
            monthlyCounts[monthKey]++;
          }
        });
        
        // Convertir en tableau pour le graphique
        const monthlyCareData = Object.entries(monthlyCounts)
          .map(([date, count]) => ({ date, count }))
          .reverse();
        
        setStatsData({
          totalPatients: patientCount || 0,
          activeAppointments: activeAppCount || 0,
          completedAppointments: completedAppCount || 0,
          unreadMessages: unreadMsgCount || 0,
          monthlyCareData,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64 md:col-span-4" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalPatients}</div>
            <p className="text-xs text-muted-foreground">patients enregistrés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous actifs</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.activeAppointments}</div>
            <p className="text-xs text-muted-foreground">rendez-vous à venir</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soins réalisés</CardTitle>
            <ActivitySquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">rendez-vous terminés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">messages non lus</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des soins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Chart 
            options={{
              chart: {
                type: 'area',
                toolbar: {
                  show: false,
                },
                zoom: {
                  enabled: false,
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'smooth',
                width: 2,
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.7,
                  opacityTo: 0.3,
                }
              },
              xaxis: {
                categories: statsData.monthlyCareData.map(data => data.date),
                labels: {
                  style: {
                    fontSize: '12px',
                  },
                }
              }
            }}
            series={[
              {
                name: 'Soins réalisés',
                data: statsData.monthlyCareData.map(data => data.count),
              }
            ]}
            type="area"
            height={300}
          />
        </CardContent>
      </Card>
    </>
  );
}
