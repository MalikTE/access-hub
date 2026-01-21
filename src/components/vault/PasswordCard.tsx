import { useState } from "react"
import { motion } from "framer-motion"
import {
  Eye,
  EyeOff,
  Copy,
  Edit2,
  Trash2,
  Clock,
  Globe,
  Mail,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PasswordEntry } from "@/components/auth/password"
import { toast } from "sonner"
import { Timestamp } from "firebase/firestore"

interface PasswordCardProps {
  entry: PasswordEntry
  onEdit: (entry: PasswordEntry) => void
  onDelete: (id: string) => void
  onRollback: (passwordId: string, oldPassword: string) => void
}

interface Props {
  entry: PasswordEntry
}

/* ================================
   SAFE DATE PARSER
================================ */
const toDateSafe = (value: any): Date => {
  if (!value) return new Date()

  if (value instanceof Timestamp) {
    return value.toDate()
  }

  if (typeof value === "string") {
    return new Date(value)
  }

  if (value.seconds) {
    return new Date(value.seconds * 1000)
  }

  return new Date()
}

export function PasswordCard({
  entry,
  onEdit,
  onDelete,
  onRollback,
}: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied`)
    } catch {
      toast.error("Copy failed")
    }
  }

  const maskedPassword =
    typeof entry.password === "string"
      ? "•".repeat(Math.min(entry.password.length, 12))
      : "••••••••"

  const lastChanged = entry.history?.length
    ? (() => {
        const last =
          entry.history[entry.history.length - 1]
        const date = toDateSafe(last.updatedAt)
        const days = Math.floor(
          (Date.now() - date.getTime()) /
            (1000 * 60 * 60 * 24)
        )
        return `Last changed ${days} days ago`
      })()
    : "Never changed"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 md:p-5 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
        <h3
  className="text-lg font-semibold text-primary hover:underline cursor-pointer"
  onClick={() => {
    if (entry.siteUrl) {
      window.open(entry.siteUrl, "_blank", "noopener,noreferrer")
    }
  }}
>
  {entry.siteName}
</h3>


          {entry.customUrl && (
            <p className="text-xs text-muted-foreground truncate max-w-[220px] flex items-center gap-1">
              <Globe className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {entry.customUrl}
              </span>
            </p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}>
            <Edit2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Username */}
      {entry.username && (
        <div className="flex items-center justify-between bg-background/50 rounded-lg px-3 py-2 mb-2">
          <div className="flex items-center gap-2 text-sm text-foreground break-all">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{entry.username}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              copyToClipboard(entry.username, "Username")
            }
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Email */}
      {entry.email !== undefined  && (
        <div className="flex items-center justify-between bg-background/50 rounded-lg px-3 py-2 mb-2">
          <div className="flex items-center gap-2 text-sm text-foreground break-all">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{entry.email}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              copyToClipboard(entry.email!, "Email")
            }
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Password */}
      <div className="flex items-center justify-between bg-background/50 rounded-lg px-3 py-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">
            Password
          </p>

          <p className="text-sm text-foreground font-mono break-all">
            {showPassword
              ? entry.password
              : maskedPassword}
          </p>

          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 shrink-0" />
            {lastChanged}
          </p>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setShowPassword((p) => !p)
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              copyToClipboard(
                entry.password,
                "Password"
              )
            }
          >
            <Copy className="h-4 w-4" />
          </Button>

          {entry.history?.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setShowHistory((p) => !p)
              }
            >
              <Clock className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* History */}
      {showHistory && entry.history?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-background/30 p-2 rounded-lg mt-2 space-y-1"
        >
          {entry.history
            .slice()
            .reverse()
            .map((h, idx) => {
              const date = toDateSafe(h.updatedAt)

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
                  onClick={() =>
                    onRollback(
                      entry.id,
                      h.password
                    )
                  }
                >
                  <span className="text-xs text-foreground font-mono break-all">
                    {h.password.length > 12
                      ? h.password.slice(0, 12) + "…"
                      : h.password}
                  </span>

                  <span className="text-xs text-muted-foreground shrink-0">
                    {date.toLocaleDateString()}
                  </span>
                </div>
              )
            })}
        </motion.div>
      )}
    </motion.div>
  )
}
