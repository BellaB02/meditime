
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignatureDocumentProps {
  doc: {
    id: string;
    title: string;
    type: string;
    date: string;
    signatureDataUrl: string;
    pdfUrl?: string;
  };
  onDownload: (doc: SignatureDocumentProps['doc']) => void;
}

export const SignatureDocument: React.FC<SignatureDocumentProps> = ({ doc, onDownload }) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md">
      <div>
        <h3 className="font-medium">{doc.title}</h3>
        <div className="text-sm text-muted-foreground mt-1">
          <div>Type: {doc.type}</div>
          <div>Date: {doc.date}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="border rounded w-16 h-10 overflow-hidden">
          <img 
            src={doc.signatureDataUrl} 
            alt="Signature" 
            className="w-full h-full object-contain"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDownload(doc)}
        >
          <Download size={16} className="mr-2" />
          Télécharger
        </Button>
      </div>
    </div>
  );
};
