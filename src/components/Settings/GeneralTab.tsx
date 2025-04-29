
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSection } from "./ProfileSection";
import { SubscriptionSection } from "./SubscriptionSection";
import { InterfaceSection } from "./InterfaceSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export function GeneralTab() {
  const [activeSubTab, setActiveSubTab] = useState("profile");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      {isMobile ? (
        <Tabs defaultValue="profile" value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="subscription">Abonnement</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <ProfileSection />
          </TabsContent>
          
          <TabsContent value="subscription" className="mt-0">
            <SubscriptionSection />
          </TabsContent>
          
          <TabsContent value="interface" className="mt-0">
            <InterfaceSection />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <ProfileSection />
          <SubscriptionSection />
          <InterfaceSection />
        </>
      )}
    </div>
  );
}
