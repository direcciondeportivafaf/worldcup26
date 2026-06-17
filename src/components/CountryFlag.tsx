import { useState } from 'react';

const COUNTRY_FLAG_MAP: Record<string, string> = {
  'USA': 'us', 'Canada': 'ca', 'Mexico': 'mx', 'Spain': 'es',
  'us': 'us', 'ca': 'ca', 'mx': 'mx', 'es': 'es',
};

export default function CountryFlag({ country, size = 'md', className = '' }: { country: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const code = COUNTRY_FLAG_MAP[country] || COUNTRY_FLAG_MAP[country.toLowerCase()] || '';
  const url = code ? `https://flagcdn.com/w80/${code}.png` : null;

  if (!url || imgError) {
    return <span className={className}>{country === 'USA' ? '🇺🇸' : country === 'Canada' ? '🇨🇦' : '🇲🇽'}</span>;
  }

  const sizeMap = { sm: 'w-5 h-4', md: 'w-7 h-5', lg: 'w-9 h-6', xl: 'w-12 h-8' };

  return (
    <img
      src={url}
      alt={country}
      loading="lazy"
      onError={() => setImgError(true)}
      className={`inline-block object-cover rounded-sm ${sizeMap[size]} ${className}`}
    />
  );
}
