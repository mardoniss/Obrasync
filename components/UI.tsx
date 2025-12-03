import React, { InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IssuePriority, IssueStatus } from '../types';
import { Camera, AlertCircle, CheckCircle2, Clock, XCircle, PlayCircle, Eye } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  disabled,
  ...props 
}) => {
  const variants = {
    primary: 'bg-accent text-white hover:bg-blue-700 shadow-sm active:bg-blue-800',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm',
    outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ className, label, error, ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Card
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm", className)} {...props}>
    {children}
  </div>
);

// Badges
export const StatusBadge: React.FC<{ status: IssueStatus }> = ({ status }) => {
  const styles = {
    [IssueStatus.OPEN]: 'bg-slate-100 text-slate-700 border-slate-200',
    [IssueStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-700 border-blue-200',
    [IssueStatus.REVIEW]: 'bg-orange-50 text-orange-700 border-orange-200',
    [IssueStatus.APPROVED]: 'bg-green-50 text-green-700 border-green-200',
    [IssueStatus.REJECTED]: 'bg-red-50 text-red-700 border-red-200',
  };

  const icons = {
    [IssueStatus.OPEN]: AlertCircle,
    [IssueStatus.IN_PROGRESS]: Clock,
    [IssueStatus.REVIEW]: Eye,
    [IssueStatus.APPROVED]: CheckCircle2,
    [IssueStatus.REJECTED]: XCircle,
  };

  const Icon = icons[status];
  
  const labels = {
    [IssueStatus.OPEN]: 'Aberto',
    [IssueStatus.IN_PROGRESS]: 'Em Andamento',
    [IssueStatus.REVIEW]: 'Em Revisão',
    [IssueStatus.APPROVED]: 'Concluído',
    [IssueStatus.REJECTED]: 'Reprovado',
  };

  return (
    <span className={cn("inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full gap-1.5", styles[status])}>
      <Icon className="w-3 h-3" />
      {labels[status]}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: IssuePriority }> = ({ priority }) => {
  const styles = {
    [IssuePriority.LOW]: 'bg-green-100 text-green-800',
    [IssuePriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [IssuePriority.HIGH]: 'bg-red-100 text-red-800',
  };

  const labels = {
    [IssuePriority.LOW]: 'Baixa',
    [IssuePriority.MEDIUM]: 'Média',
    [IssuePriority.HIGH]: 'Alta',
  };

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", styles[priority])}>
      {labels[priority]}
    </span>
  );
};

// Image Upload Button (Mock)
export const FileUploadButton: React.FC<{ onFileSelect: (file: File) => void; isLoading?: boolean; label?: string }> = ({ onFileSelect, isLoading, label = "Tirar Foto / Upload" }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" // Opens camera on mobile
        ref={inputRef} 
        className="hidden" 
        onChange={handleChange}
      />
      <Button type="button" variant="outline" onClick={handleClick} isLoading={isLoading} className="w-full">
        <Camera className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </>
  );
};