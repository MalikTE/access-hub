import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Globe, Search, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { predefinedSites, getDefaultSite, SiteInfo } from '@/data/sites';
import { PasswordEntry } from '@/types/password';

const passwordSchema = z.object({
  username: z.string().max(100, 'Username must be less than 100 characters').optional(),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters').optional().or(z.literal('')),
  password: z.string().min(1, 'Password is required').max(500, 'Password is too long'),
  customUrl: z.string().max(500, 'URL is too long').optional(),
}).refine(data => data.username || data.email, {
  message: 'Either username or email is required',
  path: ['username'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editEntry?: PasswordEntry | null;
}


export function AddPasswordModal({ isOpen, onClose, onSave, editEntry }: AddPasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteInfo>(getDefaultSite());
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [siteSearch, setSiteSearch] = useState('');
  const [customSiteName, setCustomSiteName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (editEntry) {
      const site = predefinedSites.find(s => s.id === editEntry.siteId) || {
        id: 'custom',
        name: editEntry.siteName,
        icon: editEntry.siteIcon,
        color: editEntry.siteColor,
      };
      setSelectedSite(site);
      setCustomSiteName(site.id === 'custom' ? editEntry.siteName : '');
      setValue('username', editEntry.username);
      setValue('email', editEntry.email);
      setValue('password', editEntry.password);
      setValue('customUrl', editEntry.customUrl);
    } else {
      reset();
      setSelectedSite(getDefaultSite());
      setCustomSiteName('');
    }
  }, [editEntry, setValue, reset]);

  const filteredSites = predefinedSites.filter(site =>
    site.name.toLowerCase().includes(siteSearch.toLowerCase())
  );

  const onSubmit = (data: PasswordFormData) => {
  const siteName =
    selectedSite.id === "custom"
      ? customSiteName || "Custom Site"
      : selectedSite.name
onSave({
  siteName,
  siteUrl: data.customUrl || selectedSite.url || "",
  username: data.username || "",
  email: data.email || "",
  password: data.password,
});

  reset()
  setSelectedSite(getDefaultSite())
  setCustomSiteName("")
  onClose()
}


  const handleSelectSite = (site: SiteInfo) => {
    setSelectedSite(site);
    setShowSiteDropdown(false);
    setSiteSearch('');
    if (site.id !== 'custom') {
      setCustomSiteName('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-lg rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {editEntry ? 'Edit Password' : 'Add New Password'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Site Selection */}
            <div className="space-y-2">
              <Label className="text-foreground/80">App or Website</Label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-3 bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-left hover:border-primary/30 transition-colors"
                  onClick={() => setShowSiteDropdown(!showSiteDropdown)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedSite.color}20` }}
                    >
                      {selectedSite.icon ? (
                        <img 
                          src={selectedSite.icon} 
                          alt={selectedSite.name}
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        <Globe className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="text-foreground">
                      {selectedSite.id === 'custom' && customSiteName 
                        ? customSiteName 
                        : selectedSite.name}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showSiteDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showSiteDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-xl overflow-hidden z-10 shadow-xl"
                    >
                      {/* Search */}
                      <div className="p-3 border-b border-white/10">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search sites..."
                            value={siteSearch}
                            onChange={(e) => setSiteSearch(e.target.value)}
                            className="pl-9 bg-background/50 border-white/10"
                          />
                        </div>
                      </div>

                      {/* Sites list */}
                      <div className="max-h-48 overflow-y-auto p-2">
                        {/* Custom option */}
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                          onClick={() => handleSelectSite(getDefaultSite())}
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-foreground">Custom / Other</span>
                        </button>

                        {filteredSites.map((site) => (
                          <button
                            key={site.id}
                            type="button"
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                            onClick={() => handleSelectSite(site)}
                          >
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${site.color}20` }}
                            >
                              <img 
                                src={site.icon} 
                                alt={site.name}
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                            <span className="text-foreground">{site.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Custom site name input */}
              {selectedSite.id === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <Input
                    type="text"
                    placeholder="Enter site or app name"
                    value={customSiteName}
                    onChange={(e) => setCustomSiteName(e.target.value)}
                    className="bg-background/50 border-white/10 focus:border-primary/50"
                  />
                </motion.div>
              )}
            </div>

            {/* Custom URL */}
            <div className="space-y-2">
              <Label htmlFor="customUrl" className="text-foreground/80">Website URL (optional)</Label>
              <Input
                id="customUrl"
                type="text"
                placeholder="https://example.com"
                {...register('customUrl')}
                className="bg-background/50 border-white/10 focus:border-primary/50"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground/80">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                {...register('username')}
                className="bg-background/50 border-white/10 focus:border-primary/50"
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="bg-background/50 border-white/10 focus:border-primary/50"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="bg-background/50 border-white/10 focus:border-primary/50 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-teal-400 hover:opacity-90 text-primary-foreground font-semibold py-6"
            >
              {editEntry ? 'Save Changes' : 'Add Password'}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
