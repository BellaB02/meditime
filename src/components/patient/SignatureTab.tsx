
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature } from "lucide-react";
import { SignatureDocumentList } from "./signature/SignatureDocumentList";
import { CreateSignatureDialog } from "./signature/CreateSignatureDialog";
import { useSignatureTab } from "./signature/useSignatureTab";

interface SignatureTabProps {
  patientId: string;
  patientName: string;
}

const SignatureTab: React.FC<SignatureTabProps> = ({ patientId, patientName }) => {
  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    signedDocuments, 
    handleCreateDocument, 
    handleDownload 
  } = useSignatureTab(patientId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Documents signés</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            <FileSignature size={16} className="mr-2" />
            Nouveau document à signer
          </Button>
        </CardHeader>
        <CardContent>
          <SignatureDocumentList 
            documents={signedDocuments} 
            onDownload={handleDownload} 
          />
        </CardContent>
      </Card>

      <CreateSignatureDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleCreateDocument}
        patientName={patientName}
      />
    </div>
  );
};

export default SignatureTab;
