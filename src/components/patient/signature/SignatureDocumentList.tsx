
import React from "react";
import { FileSignature } from "lucide-react";
import { SignatureDocument } from "./SignatureDocument";

interface SignedDocument {
  id: string;
  title: string;
  type: string;
  date: string;
  signatureDataUrl: string;
  pdfUrl?: string;
}

interface SignatureDocumentListProps {
  documents: SignedDocument[];
  onDownload: (doc: SignedDocument) => void;
}

export const SignatureDocumentList: React.FC<SignatureDocumentListProps> = ({ 
  documents, 
  onDownload 
}) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <FileSignature className="mx-auto h-8 w-8 mb-2" />
        <p>Aucun document signé</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <SignatureDocument 
          key={doc.id} 
          doc={doc} 
          onDownload={onDownload} 
        />
      ))}
    </div>
  );
};
