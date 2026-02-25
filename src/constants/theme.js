export const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#A5B4FC',
  secondary: '#F472B6',
  accent: '#FBBF24',
  success: '#34D399',
  successDark: '#10B981',
  warning: '#FB923C',
  danger: '#F87171',
  dangerDark: '#EF4444',

  bg: '#F8FAFC',
  bgGradientStart: '#E0F2FE',
  bgGradientEnd: '#F0FDF4',
  card: '#FFFFFF',
  cardShadow: '#00000015',

  text: '#1E293B',
  textMedium: '#475569',
  textLight: '#94A3B8',
  textWhite: '#FFFFFF',

  gridBg: '#ECFDF5',
  gridLine: '#D1FAE5',
  wall: '#065F46',
  path: '#F0FDF4',
  goal: '#FDE047',
  star: '#FBBF24',
  gem: '#C084FC',
  water: '#38BDF8',
  lava: '#FB7185',

  blockMove: '#6366F1',
  blockTurn: '#F472B6',
  blockLoop: '#34D399',
  blockCondition: '#FB923C',
  blockEnd: '#CBD5E1',

  tabActive: '#6366F1',
  tabInactive: '#CBD5E1',

  world1: '#34D399',
  world2: '#38BDF8',
  world3: '#FBBF24',
  world4: '#10B981',
  world5: '#94A3B8',
  world6: '#C084FC',
  world7: '#FB7185',
  world8: '#2DD4BF',
  
  overlay: 'rgba(15, 23, 42, 0.6)',
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassStroke: 'rgba(255, 255, 255, 0.5)',
};

export const GRADIENTS = {
  primary: ['#6366F1', '#8B5CF6'],
  success: ['#34D399', '#10B981'],
  danger: ['#F87171', '#EF4444'],
  warning: ['#FBBF24', '#F59E0B'],
  card: ['#FFFFFF', '#F8FAFC'],
  forest: ['#D1FAE5', '#A7F3D0'],
};

export const FONTS = {
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  body: { fontSize: 16, fontWeight: '500' },
  caption: { fontSize: 13, fontWeight: '500' },
  button: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  blockText: { fontSize: 14, fontWeight: '700' },
};

export const SIZES = {
  padding: 16,
  paddingLg: 24,
  radius: 20,
  radiusMd: 16,
  radiusSm: 12,
  radiusXs: 8,
  cellSize: 48,
  blockHeight: 52,
  tabIconSize: 26,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHover: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  button: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonSuccess: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  glow: {
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const ANIMATIONS = {
  spring: { damping: 15, stiffness: 150 },
  springBouncy: { damping: 10, stiffness: 180 },
  timing: { duration: 300 },
  timingFast: { duration: 150 },
  timingSlow: { duration: 500 },
};
