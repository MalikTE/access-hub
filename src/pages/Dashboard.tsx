import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { LogOut } from "lucide-react"
import { Timestamp } from "firebase/firestore"

import { VaultHeader } from "@/components/vault/VaultHeader"
import { PasswordCard } from "@/components/vault/PasswordCard"
import { AddPasswordModal } from "@/components/vault/AddPasswordModal"
import { EmptyState } from "@/components/vault/EmptyState"
import { FilterBar } from "@/components/vault/FilterBar"

import { PasswordEntry } from "@/types/password"
import { toast } from "sonner"
import { auth } from "@/firebase"

import { decryptPassword, encryptPassword } from "@/utils/crypto"

import {
  addPassword,
  getPasswords,
  deletePassword,
  editPassword,
} from "@/components/auth/password"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

/* 🔐 Safe decrypt */
const safeDecrypt = (value: string) => {
  try {
    return decryptPassword(value)
  } catch {
    return "••••••"
  }
}

export default function Dashboard() {
  const navigate = useNavigate()

  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([])
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<PasswordEntry | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /* 🔒 Protect route */
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      navigate("/", { replace: true })
      return
    }

    await loadPasswords()
  })

  return () => unsub()
}, [navigate])


  /* 📥 Load */
 const loadPasswords = async() => {
  setLoading(true)

  try {
    if (!auth.currentUser) return

    const data = await getPasswords(auth.currentUser.uid)

    const formatted: PasswordEntry[] = data.map((item: any) => ({
      id: item.id,
      siteName: item.siteName || "Unknown",
siteUrl: item.siteUrl || "",

      username: item.username || "",
      email: item.email || "",
      password: safeDecrypt(item.password),
      history:
        item.history?.map((h: any) => ({
          password: safeDecrypt(h.password),
          updatedAt: h.updatedAt?.toDate?.() || new Date(),
        })) || [],
      createdAt: item.createdAt?.toDate?.() || new Date(),
      updatedAt: item.updatedAt?.toDate?.() || new Date(),
    }))

    setPasswords(formatted)
  } catch (err) {
    console.error("LOAD ERROR:", err)
    toast.error("Failed to load passwords")
  } finally {
    setLoading(false) // ALWAYS STOP LOADING
  }
}



  /* 🚪 Sign out */
  const handleSignOut = async() => {
    try {
      await signOut(auth)
      navigate("/", { replace: true })
    } catch {
      toast.error("Sign out failed")
    }
  }

  /* 🔍 Filters */
  const uniqueWebsites = useMemo(
    () => [...new Set(passwords.map((p) => p.siteName))].sort(),
    [passwords]
  )

  const uniqueEmails = useMemo(
    () => [...new Set(passwords.map((p) => p.email).filter(Boolean))].sort(),
    [passwords]
  )

  const filteredPasswords = useMemo(() => {
    let result = passwords
    const q = searchQuery.toLowerCase()

    if (q) {
      result = result.filter(
        (p) =>
          p.siteName.toLowerCase().includes(q) ||
          p.username.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q)
      )
    }

    if (selectedWebsites.length) {
      result = result.filter((p) =>
        selectedWebsites.includes(p.siteName)
      )
    }

    if (selectedEmails.length) {
      result = result.filter((p) =>
        selectedEmails.includes(p.email || "")
      )
    }

    return result
  }, [passwords, searchQuery, selectedWebsites, selectedEmails])

  /* 💾 Save */
 const handleSavePassword = async(
  data: Omit<PasswordEntry, "id" | "createdAt" | "updatedAt" | "history">
) => {
  if (!auth.currentUser) return

  try {
    const encrypted = encryptPassword(data.password)

    if (editEntry) {
      const oldEntry = passwords.find((p) => p.id === editEntry.id)

      const encryptedHistory =
        oldEntry?.history.map((h) => ({
          password: encryptPassword(h.password),
          updatedAt: Timestamp.fromDate(new Date(h.updatedAt)),
        })) || []

      if (oldEntry?.password) {
        encryptedHistory.push({
          password: encryptPassword(oldEntry.password),
          updatedAt: Timestamp.now(),
        })
      }

      await editPassword(auth.currentUser.uid, editEntry.id, {
        siteName: data.siteName,
        siteUrl: data.siteUrl || "", 
        username: data.username,
        email: data.email || "",
        password: encrypted,
        history: encryptedHistory,
      })

      toast.success("Password updated")
    } else {
      await addPassword(auth.currentUser.uid, {
  siteName: data.siteName,
  siteUrl: data.siteUrl,
  username: data.username,
  email: data.email,
  password: encrypted,
})


      toast.success("Password added")
    }

    await loadPasswords()
    setIsModalOpen(false)
    setEditEntry(null)
  } catch (err) {
    console.error("SAVE ERROR:", err)
    toast.error("Failed to save password")
  }
}


  /* 🗑 Delete */
  const confirmDelete = async() => {
    if (!deleteId || !auth.currentUser) return

    try {
      await deletePassword(auth.currentUser.uid, deleteId)
      setPasswords((prev) => prev.filter((p) => p.id !== deleteId))
      toast.success("Password deleted")
    } catch {
      toast.error("Delete failed")
    } finally {
      setDeleteId(null)
    }
  }

  /* 🔁 Rollback */
  const handleRollback = async(passwordId: string, oldPassword: string) => {
    if (!auth.currentUser) return

    try {
      const entry = passwords.find((p) => p.id === passwordId)
      if (!entry) return

      const encryptedHistory =
        entry.history.map((h) => ({
          password: encryptPassword(h.password),
          updatedAt: Timestamp.fromDate(new Date(h.updatedAt)),
        })) || []

      encryptedHistory.push({
        password: encryptPassword(entry.password),
        updatedAt: Timestamp.now(),
      })

      await editPassword(auth.currentUser.uid, passwordId, {
        site: entry.siteName,
        username: entry.username,
        password: encryptPassword(oldPassword),
        history: encryptedHistory,
      })

      toast.success("Password rolled back")
      await loadPasswords()
    } catch {
      toast.error("Rollback failed")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <VaultHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsModalOpen(true)}
        totalPasswords={passwords.length}
      />

      <div className="flex justify-end px-6 pt-3">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      <main className="container mx-auto px-4 py-6">
        {loading && (
          <p className="text-center text-muted-foreground">
            Loading your vault...
          </p>
        )}

        {!loading && passwords.length > 0 && (
          <FilterBar
            websites={uniqueWebsites}
            emails={uniqueEmails}
            selectedWebsites={selectedWebsites}
            selectedEmails={selectedEmails}
            onWebsiteChange={setSelectedWebsites}
            onEmailChange={setSelectedEmails}
            onClearFilters={() => {
              setSelectedWebsites([])
              setSelectedEmails([])
            }}
          />
        )}

        {!loading && passwords.length === 0 ? (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filteredPasswords.map((entry) => (
                <PasswordCard
                  key={entry.id}
                  entry={entry}
                  onEdit={(e) => {
                    setEditEntry(e)
                    setIsModalOpen(true)
                  }}
                  onDelete={() => setDeleteId(entry.id)}
                  onRollback={handleRollback}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <AddPasswordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditEntry(null)
        }}
        onSave={handleSavePassword}
        editEntry={editEntry}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Password</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
