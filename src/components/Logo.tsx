import { Flame } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40,
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Flame
          size={iconSizes[size]}
          className="text-emerald-600"
          fill="currentColor"
        />
      </div>
      <span className={`font-bold ${sizes[size]} ${textColor}`}>
        Fit<span className="text-emerald-600">Forge</span>
      </span>
    </div>
  );
}
