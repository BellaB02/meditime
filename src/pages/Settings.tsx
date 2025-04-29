
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingTab } from "@/components/Settings/PricingTab";
import { CareTypesTab } from "@/components/Settings/CareTypesTab";
import { GeneralTab } from "@/components/Settings/GeneralTab";
import { toast } from "sonner";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const isMobile = useIsMobile();
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre application et de votre pratique.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`${isMobile ? "w-full grid grid-cols-3" : ""}`}>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="pricing">Tarifs</TabsTrigger>
          <TabsTrigger value="care-types">Types de soins</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <GeneralTab />
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4 mt-4">
          <PricingTab />
        </TabsContent>
        
        <TabsContent value="care-types" className="space-y-4 mt-4">
          <CareTypesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
