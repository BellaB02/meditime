
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingTab } from "@/components/Settings/PricingTab";
import { CareTypesTab } from "@/components/Settings/CareTypesTab";
import { toast } from "sonner";
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("pricing");
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre application et de votre pratique.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pricing">Tarifs</TabsTrigger>
          <TabsTrigger value="care-types">Types de soins</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pricing" className="space-y-4">
          <PricingTab />
        </TabsContent>
        
        <TabsContent value="care-types" className="space-y-4">
          <CareTypesTab />
        </TabsContent>
        
        <TabsContent value="general" className="space-y-4">
          <div className="text-center py-20 text-muted-foreground">
            Paramètres généraux à venir...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
