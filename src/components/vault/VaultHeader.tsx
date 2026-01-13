import { motion } from 'framer-motion';
import { Plus, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VaultHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
  totalPasswords: number;
}

export function VaultHeader({ searchQuery, onSearchChange, onAddClick, totalPasswords }: VaultHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        {/* Top row - Logo and Add button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SecureVault</h1>
              <p className="text-xs text-muted-foreground">{totalPasswords} passwords</p>
            </div>
          </div>
          
          <Button
            onClick={onAddClick}
            className="bg-gradient-to-r from-primary to-teal-400 hover:opacity-90 text-primary-foreground font-semibold gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Password</span>
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search passwords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 bg-background/50 border-white/10 focus:border-primary/50 h-11"
          />
        </div>
      </div>
    </motion.header>
  );
}
