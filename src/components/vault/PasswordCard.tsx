import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Copy, Edit2, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordEntry } from '@/types/password';
import { toast } from 'sonner';

interface PasswordCardProps {
  entry: PasswordEntry;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export function PasswordCard({ entry, onEdit, onDelete }: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const maskedPassword = '•'.repeat(Math.min(entry.password.length, 12));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 md:p-5 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group"
    >
      {/* Header with icon and site name */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: `${entry.siteColor}20` }}
          >
            {entry.siteIcon ? (
              <img 
                src={entry.siteIcon} 
                alt={entry.siteName}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Globe 
              className={`w-6 h-6 text-primary ${entry.siteIcon ? 'hidden' : ''}`}
              style={{ color: entry.siteColor }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{entry.siteName}</h3>
            {entry.customUrl && (
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{entry.customUrl}</p>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(entry)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Credentials */}
      <div className="space-y-3">
        {/* Username */}
        {entry.username && (
          <div className="flex items-center justify-between bg-background/50 rounded-lg px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">Username</p>
              <p className="text-sm text-foreground truncate">{entry.username}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
              onClick={() => copyToClipboard(entry.username, 'Username')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Email */}
        {entry.email && (
          <div className="flex items-center justify-between bg-background/50 rounded-lg px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="text-sm text-foreground truncate">{entry.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
              onClick={() => copyToClipboard(entry.email, 'Email')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Password */}
        <div className="flex items-center justify-between bg-background/50 rounded-lg px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Password</p>
            <p className="text-sm text-foreground font-mono">
              {showPassword ? entry.password : maskedPassword}
            </p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => copyToClipboard(entry.password, 'Password')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
