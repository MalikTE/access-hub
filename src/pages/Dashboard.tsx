import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VaultHeader } from '@/components/vault/VaultHeader';
import { PasswordCard } from '@/components/vault/PasswordCard';
import { AddPasswordModal } from '@/components/vault/AddPasswordModal';
import { EmptyState } from '@/components/vault/EmptyState';
import { PasswordEntry } from '@/types/password';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Sample data for demo
const samplePasswords: PasswordEntry[] = [
  {
    id: '1',
    siteId: 'google',
    siteName: 'Google',
    siteIcon: 'https://www.google.com/favicon.ico',
    siteColor: '#4285F4',
    username: 'john.doe',
    email: 'john.doe@gmail.com',
    password: 'MySecurePassword123!',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    siteId: 'github',
    siteName: 'GitHub',
    siteIcon: 'https://github.githubassets.com/favicons/favicon.svg',
    siteColor: '#181717',
    username: 'johndoe',
    email: 'john.doe@gmail.com',
    password: 'GitHubPass456!',
    customUrl: 'https://github.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    siteId: 'netflix',
    siteName: 'Netflix',
    siteIcon: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
    siteColor: '#E50914',
    username: '',
    email: 'john.doe@gmail.com',
    password: 'NetflixSecure789!',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Dashboard() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>(samplePasswords);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<PasswordEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredPasswords = useMemo(() => {
    if (!searchQuery.trim()) return passwords;
    
    const query = searchQuery.toLowerCase();
    return passwords.filter(
      (entry) =>
        entry.siteName.toLowerCase().includes(query) ||
        entry.username.toLowerCase().includes(query) ||
        entry.email.toLowerCase().includes(query)
    );
  }, [passwords, searchQuery]);

  const handleAddPassword = (data: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editEntry) {
      // Update existing
      setPasswords((prev) =>
        prev.map((p) =>
          p.id === editEntry.id
            ? { ...p, ...data, updatedAt: new Date() }
            : p
        )
      );
      toast.success('Password updated successfully');
    } else {
      // Add new
      const newEntry: PasswordEntry = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPasswords((prev) => [newEntry, ...prev]);
      toast.success('Password added successfully');
    }
    setEditEntry(null);
  };

  const handleEdit = (entry: PasswordEntry) => {
    setEditEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setPasswords((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Password deleted');
      setDeleteId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditEntry(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <VaultHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsModalOpen(true)}
        totalPasswords={passwords.length}
      />

      <main className="container mx-auto px-4 py-6 relative z-10">
        {passwords.length === 0 ? (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        ) : filteredPasswords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground">No passwords match your search.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredPasswords.map((entry) => (
                <PasswordCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AddPasswordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddPassword}
        editEntry={editEntry}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Password</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this password? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
