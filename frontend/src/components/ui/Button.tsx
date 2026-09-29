import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'gold' 
  | 'flame' 
  | 'azure' 
  | 'purple' 
  | 'outline' 
  | 'ghost'
  | 'sky'
  | 'listening'
  | 'emerald'
  | 'reading'
  | 'amber'
  | 'writing'
  | 'rose'
  | 'speaking';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 
    'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_4px_0_#047857] active:shadow-none active:translate-y-[4px] border-b-2 border-emerald-600',
  secondary: 
    'bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-[0_4px_0_#1e293b] active:shadow-none active:translate-y-[4px] border-b-2 border-slate-800',
  danger: 
    'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_4px_0_#b91c1c] active:shadow-none active:translate-y-[4px] border-b-2 border-rose-600',
  gold: 
    'bg-amber-500 hover:bg-amber-400 text-yellow-950 font-black shadow-[0_4px_0_#a16207] active:shadow-none active:translate-y-[4px] border-b-2 border-amber-600',
  flame: 
    'bg-orange-500 hover:bg-orange-400 text-white font-bold shadow-[0_4px_0_#c2410c] active:shadow-none active:translate-y-[4px] border-b-2 border-orange-600',
  azure: 
    'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_0_#1d4ed8] active:shadow-none active:translate-y-[4px] border-b-2 border-blue-700',
  purple: 
    'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_4px_0_#6d28d9] active:shadow-none active:translate-y-[4px] border-b-2 border-purple-700',
  outline: 
    'bg-transparent hover:bg-slate-800/60 text-slate-200 border-2 border-slate-600 shadow-[0_3px_0_#334155] active:shadow-none active:translate-y-[3px]',
  ghost: 
    'bg-transparent hover:bg-slate-800/40 text-slate-300 active:bg-slate-800/80',
  sky: 
    'bg-sky-500 hover:bg-sky-400 text-white font-bold shadow-[0_4px_0_#0369a1] active:shadow-none active:translate-y-[4px] border-b-2 border-sky-600',
  listening: 
    'bg-sky-500 hover:bg-sky-400 text-white font-bold shadow-[0_4px_0_#0369a1] active:shadow-none active:translate-y-[4px] border-b-2 border-sky-600',
  emerald: 
    'bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-[0_4px_0_#047857] active:shadow-none active:translate-y-[4px] border-b-2 border-emerald-600',
  reading: 
    'bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-[0_4px_0_#047857] active:shadow-none active:translate-y-[4px] border-b-2 border-emerald-600',
  amber: 
    'bg-amber-500 hover:bg-amber-400 text-yellow-950 font-black shadow-[0_4px_0_#b45309] active:shadow-none active:translate-y-[4px] border-b-2 border-amber-600',
  writing: 
    'bg-amber-500 hover:bg-amber-400 text-yellow-950 font-black shadow-[0_4px_0_#b45309] active:shadow-none active:translate-y-[4px] border-b-2 border-amber-600',
  rose: 
    'bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-[0_4px_0_#be123c] active:shadow-none active:translate-y-[4px] border-b-2 border-rose-600',
  speaking: 
    'bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-[0_4px_0_#be123c] active:shadow-none active:translate-y-[4px] border-b-2 border-rose-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-bold rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm font-extrabold rounded-2xl gap-2',
  lg: 'px-6 py-3.5 text-base font-black rounded-2xl gap-2.5',
  xl: 'px-8 py-4 text-lg font-black tracking-wide rounded-3xl gap-3',
  icon: 'p-2.5 rounded-2xl justify-center items-center',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const is3D = variant !== 'ghost';
  
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center select-none
        transition-all duration-100 ease-out cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:shadow-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
