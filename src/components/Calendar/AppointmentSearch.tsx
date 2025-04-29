
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface AppointmentSearchProps {
  onSearch: (query: string) => void;
}

export const AppointmentSearch = ({ onSearch }: AppointmentSearchProps) => {
  const [query, setQuery] = useState("");
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mb-4"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Rechercher un patient ou un soin..."
        className="pl-9 w-full"
        value={query}
        onChange={handleSearch}
      />
    </motion.div>
  );
};
