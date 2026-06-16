import { useState } from 'react';

// Map FIFA team IDs (lowercase TLA) → flagcdn.com country codes
const FLAG_CDN_MAP: Record<string, string> = {
  mex: 'mx', kor: 'kr', cze: 'cz', rsa: 'za',
  sui: 'ch', can: 'ca', qat: 'qa', bih: 'ba',
  sco: 'gb-sct', mar: 'ma', bra: 'br', hai: 'ht',
  usa: 'us', aus: 'au', tur: 'tr', par: 'py',
  ger: 'de', civ: 'ci', ecu: 'ec', cuw: 'cw',
  swe: 'se', jpn: 'jp', ned: 'nl', tun: 'tn',
  egy: 'eg', bel: 'be', irn: 'ir', nzl: 'nz',
  cpv: 'cv', ksa: 'sa', esp: 'es', ury: 'uy',
  fra: 'fr', irq: 'iq', nor: 'no', sen: 'sn',
  alg: 'dz', arg: 'ar', jor: 'jo', aut: 'at',
  cod: 'cd', col: 'co', por: 'pt', uzb: 'uz',
  eng: 'gb-eng', gha: 'gh', cro: 'hr', pan: 'pa',
};

function getFlagUrl(teamId: string): string | null {
  const code = FLAG_CDN_MAP[teamId];
  if (!code) return null;
  return `https://flagcdn.com/w80/${code}.png`;
}

interface FlagImgProps {
  teamId: string;
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-5 h-4',
  md: 'w-7 h-5',
  lg: 'w-9 h-6',
  xl: 'w-12 h-8',
};

export default function FlagImg({ teamId, emoji, size = 'md', className = '' }: FlagImgProps) {
  const [imgError, setImgError] = useState(false);
  const url = getFlagUrl(teamId);

  if (!url || imgError) {
    return <span className={className}>{emoji}</span>;
  }

  return (
    <img
      src={url}
      alt={teamId}
      loading="lazy"
      onError={() => setImgError(true)}
      className={`inline-block object-cover rounded-sm ${SIZE_MAP[size]} ${className}`}
    />
  );
}
