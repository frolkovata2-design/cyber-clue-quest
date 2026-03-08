import { motion } from 'framer-motion';
import { FileText, Mail, Terminal, User, File, AlertTriangle } from 'lucide-react';

interface EvidenceCardProps {
  evidence: {
    id: string;
    title: string;
    type: 'document' | 'log' | 'email' | 'testimony' | 'file';
    description: string;
    violationRef?: string;
    isSecret: boolean;
  };
}

const typeConfig = {
  document: { icon: FileText, label: 'Документ' },
  log: { icon: Terminal, label: 'Лог' },
  email: { icon: Mail, label: 'Письмо' },
  testimony: { icon: User, label: 'Показание' },
  file: { icon: File, label: 'Файл' },
};

const EvidenceCard = ({ evidence }: EvidenceCardProps) => {
  const config = typeConfig[evidence.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative rounded-lg border border-primary/30 bg-card p-4 box-glow-cyan group hover:border-primary/60 transition-all cursor-pointer"
    >
      {evidence.isSecret && (
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-warning flex items-center justify-center">
          <span className="text-[10px] font-bold text-warning-foreground">★</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-mono text-primary/70 uppercase tracking-wider mb-0.5">{config.label}</p>
          <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">{evidence.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{evidence.description}</p>
          {evidence.violationRef && (
            <div className="mt-2 flex items-center gap-1 text-destructive">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-[10px] font-mono font-medium">{evidence.violationRef}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EvidenceCard;
