import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Globe, Mail, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  websites: string[];
  emails: string[];
  selectedWebsites: string[];
  selectedEmails: string[];
  onWebsiteChange: (websites: string[]) => void;
  onEmailChange: (emails: string[]) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  websites,
  emails,
  selectedWebsites,
  selectedEmails,
  onWebsiteChange,
  onEmailChange,
  onClearFilters,
}: FilterBarProps) {
  const [showWebsiteDropdown, setShowWebsiteDropdown] = useState(false);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);

  const hasActiveFilters = selectedWebsites.length > 0 || selectedEmails.length > 0;
  const totalFilters = selectedWebsites.length + selectedEmails.length;

  const toggleWebsite = (website: string) => {
    if (selectedWebsites.includes(website)) {
      onWebsiteChange(selectedWebsites.filter((w) => w !== website));
    } else {
      onWebsiteChange([...selectedWebsites, website]);
    }
  };

  const toggleEmail = (email: string) => {
    if (selectedEmails.includes(email)) {
      onEmailChange(selectedEmails.filter((e) => e !== email));
    } else {
      onEmailChange([...selectedEmails, email]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-4"
    >
      {/* Filter indicator */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Filters</span>
      </div>

      {/* Website Filter */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 bg-background/50 hover:bg-white/5 gap-2"
          onClick={() => {
            setShowWebsiteDropdown(!showWebsiteDropdown);
            setShowEmailDropdown(false);
          }}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">Website</span>
          {selectedWebsites.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/20 text-primary">
              {selectedWebsites.length}
            </Badge>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${showWebsiteDropdown ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {showWebsiteDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-56 bg-card border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2 max-h-64 overflow-y-auto">
                {websites.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">No websites found</p>
                ) : (
                  websites.map((website) => (
                    <button
                      key={website}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        selectedWebsites.includes(website)
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-white/5 text-foreground'
                      }`}
                      onClick={() => toggleWebsite(website)}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedWebsites.includes(website)
                            ? 'bg-primary border-primary'
                            : 'border-white/30'
                        }`}
                      >
                        {selectedWebsites.includes(website) && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-primary-foreground"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        )}
                      </div>
                      <span className="truncate">{website}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Filter */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 bg-background/50 hover:bg-white/5 gap-2"
          onClick={() => {
            setShowEmailDropdown(!showEmailDropdown);
            setShowWebsiteDropdown(false);
          }}
        >
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Email</span>
          {selectedEmails.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/20 text-primary">
              {selectedEmails.length}
            </Badge>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${showEmailDropdown ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {showEmailDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-64 bg-card border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2 max-h-64 overflow-y-auto">
                {emails.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">No emails found</p>
                ) : (
                  emails.map((email) => (
                    <button
                      key={email}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        selectedEmails.includes(email)
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-white/5 text-foreground'
                      }`}
                      onClick={() => toggleEmail(email)}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          selectedEmails.includes(email)
                            ? 'bg-primary border-primary'
                            : 'border-white/30'
                        }`}
                      >
                        {selectedEmails.includes(email) && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-primary-foreground"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        )}
                      </div>
                      <span className="truncate">{email}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active filters display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2"
          >
            <div className="h-4 w-px bg-white/10" />
            <Badge variant="outline" className="border-primary/30 text-primary gap-1">
              {totalFilters} active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
              onClick={onClearFilters}
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside handler */}
      {(showWebsiteDropdown || showEmailDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowWebsiteDropdown(false);
            setShowEmailDropdown(false);
          }}
        />
      )}
    </motion.div>
  );
}
