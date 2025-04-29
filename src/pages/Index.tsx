
import React from 'react';
import { StatsCards } from "@/components/Dashboard/StatsCards";
import { UserWelcome } from "@/components/Dashboard/UserWelcome";
import { DailyCareProgress } from "@/components/Dashboard/DailyCareProgress";
import { AppointmentList } from "@/components/Dashboard/AppointmentList";
import { StatsModule } from "@/components/Dashboard/StatsModule";

const Index = () => {
  return (
    <div className="space-y-6">
      <UserWelcome />
      
      <StatsModule />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatsCards className="lg:col-span-2" />
        <DailyCareProgress className="" />
      </div>
      
      <AppointmentList />
    </div>
  );
};

export default Index;
