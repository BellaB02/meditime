
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.includes('image/')) {
        return;
      }
      
      onFileSelected(selectedFile);
    }
  };
  
  return (
    <div className="border-2 border-dashed rounded-md p-8 text-center space-y-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange} 
      />
      <div className="flex justify-center">
        <Camera size={48} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          Prenez en photo ou téléversez une ordonnance pour l'analyser
        </p>
        <div className="flex justify-center mt-4 gap-4">
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <Camera size={16} className="mr-2" />
            Prendre une photo
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <Upload size={16} className="mr-2" />
            Téléverser
          </Button>
        </div>
      </div>
    </div>
  );
};
