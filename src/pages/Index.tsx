import { motion } from "framer-motion";
import ShieldIcon from "@/components/icons/ShieldIcon";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(174 72% 46%) 1px, transparent 1px),
              linear-gradient(90deg, hsl(174 72% 46%) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start mb-8">
              <ShieldIcon className="w-24 h-24 animate-float" />
            </div>
            <h1 className="text-4xl xl:text-5xl font-display font-bold mb-4">
              <span className="text-gradient">VaultGuard</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your secure gateway to all your passwords. Military-grade encryption meets seamless access.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                { icon: "🔐", text: "256-bit AES encryption" },
                { icon: "🔄", text: "Sync across all devices" },
                { icon: "⚡", text: "One-click autofill" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <ShieldIcon className="w-16 h-16" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold">
                <span className="text-gradient">VaultGuard</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Secure password management
              </p>
            </div>

            {/* Login card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-card">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground">
                  Welcome back
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your credentials to unlock your vault
                </p>
              </div>

              <LoginForm />
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Protected by 256-bit AES encryption
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;