import { motion } from 'framer-motion';
import { ShieldPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <ShieldPlus className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No passwords yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start securing your accounts by adding your first password to the vault.
      </p>
      <Button
        onClick={onAddClick}
        className="bg-gradient-to-r from-primary to-teal-400 hover:opacity-90 text-primary-foreground font-semibold gap-2"
      >
        <ShieldPlus className="w-4 h-4" />
        Add Your First Password
      </Button>
    </motion.div>
  );
}
