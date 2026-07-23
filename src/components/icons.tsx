import React from 'react';

export const IconWrapper: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 20,
  color = 'currentColor',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

export const LayoutDashboard: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="15" width="7" height="6" />
  </IconWrapper>
);

export const Building2: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </IconWrapper>
);

export const FileCheck: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m9 15 2 2 4-4" />
  </IconWrapper>
);

export const FolderTree: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z" />
    <path d="M4 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H1.5" />
    <path d="M12 10v6" />
    <path d="M12 16H8" />
  </IconWrapper>
);

export const CreditCard: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </IconWrapper>
);

export const Truck: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </IconWrapper>
);

export const LifeBuoy: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <path d="M4.93 4.93l4.24 4.24" />
    <path d="M14.83 9.17l4.24-4.24" />
    <path d="M14.83 14.83l4.24 4.24" />
    <path d="M9.17 14.83l-4.24 4.24" />
  </IconWrapper>
);

export const FileText: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </IconWrapper>
);

export const Settings: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </IconWrapper>
);

export const ShieldAlert: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </IconWrapper>
);

export const BarChart3: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </IconWrapper>
);

export const LogOut: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </IconWrapper>
);

export const Search: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </IconWrapper>
);

export const Bell: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </IconWrapper>
);

export const ShieldCheck: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </IconWrapper>
);

export const Lock: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconWrapper>
);

export const Mail: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </IconWrapper>
);

export const Building2Icon = Building2;
export const ShoppingBag: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" x2="21" y1="6" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </IconWrapper>
);

export const IndianRupee: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13l8.5 8" />
    <path d="M6 13h3a4.5 4.5 0 0 0 0-9" />
  </IconWrapper>
);

export const TrendingUp: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </IconWrapper>
);

export const AlertTriangle: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </IconWrapper>
);

export const ArrowUpRight: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <line x1="7" x2="17" y1="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </IconWrapper>
);

export const Filter: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </IconWrapper>
);

export const AlertOctagon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </IconWrapper>
);

export const CheckCircle2: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </IconWrapper>
);

export const XCircle: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </IconWrapper>
);

export const ExternalLink: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </IconWrapper>
);

export const Plus: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <line x1="12" x2="12" y1="5" y2="19" />
    <line x1="5" x2="19" y1="12" y2="12" />
  </IconWrapper>
);

export const Tag: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.42 0l7.58-7.58a1 1 0 0 0 0-1.42L12 2Z" />
    <circle cx="7" cy="7" r="2" />
  </IconWrapper>
);

export const Layers: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </IconWrapper>
);

export const RefreshCw: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </IconWrapper>
);

export const AlertCircle: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </IconWrapper>
);

export const Car: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </IconWrapper>
);

export const Bike: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
  </IconWrapper>
);

export const Clock: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </IconWrapper>
);

export const UserCheck: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </IconWrapper>
);

export const Languages: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </IconWrapper>
);

export const Megaphone: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="m3 11 18-5v12L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </IconWrapper>
);

export const Save: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </IconWrapper>
);

export const Printer: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </IconWrapper>
);

export const Sliders: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = (props) => (
  <IconWrapper {...props}>
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="2" x2="6" y1="14" y2="14" />
    <line x1="10" x2="14" y1="8" y2="8" />
    <line x1="18" x2="22" y1="16" y2="16" />
  </IconWrapper>
);
