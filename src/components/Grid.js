import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  Easing,
  interpolate,
  withRepeat,
} from 'react-native-reanimated';
import { CELL_TYPES } from '../constants/blocks';
import { SHADOWS } from '../constants/theme';

const CELL_ICONS = {
  [CELL_TYPES.STAR]: '⭐',
  [CELL_TYPES.GEM]: '💎',
  [CELL_TYPES.WATER]: '🌊',
  [CELL_TYPES.LAVA]: '🔥',
  [CELL_TYPES.GOAL]: '🏠',
  [CELL_TYPES.START]: '',
};

const CELL_BG = {
  [CELL_TYPES.PATH]: '#B8E6B0',
  [CELL_TYPES.WALL]: '#2D5A3D',
  [CELL_TYPES.STAR]: '#D4F0C8',
  [CELL_TYPES.GEM]: '#E8F4FF',
  [CELL_TYPES.WATER]: '#87CEEB',
  [CELL_TYPES.LAVA]: '#FF6B6B',
  [CELL_TYPES.GOAL]: '#FFF3B8',
  [CELL_TYPES.START]: '#C8ECC0',
};

const WALL_DECOR = ['🌲', '🌳', '🪨', '🌲', '🌳'];

function getWallDecor(r, c) {
  return WALL_DECOR[(r * 7 + c * 13) % WALL_DECOR.length];
}

export default function Grid({ grid, characterRow, characterCol, cellSize: propCellSize, maxWidth }) {
  if (!grid || grid.length === 0) return null;

  const cols = grid[0].length;
  const rows = grid.length;
  const autoSize = maxWidth ? Math.floor((maxWidth - 8) / cols) : 44;
  const cellSize = Math.min(propCellSize || autoSize, 56);

  const foxX = useSharedValue(characterCol * cellSize);
  const foxY = useSharedValue(characterRow * cellSize);
  const foxScale = useSharedValue(1);
  const foxRotate = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    // Smooth spring animation for movement
    foxX.value = withSpring(characterCol * cellSize, {
      damping: 12,
      stiffness: 120,
      mass: 0.8,
    });
    foxY.value = withSpring(characterRow * cellSize, {
      damping: 12,
      stiffness: 120,
      mass: 0.8,
    });
    
    // Bounce effect when moving
    foxScale.value = withSequence(
      withTiming(1.15, { duration: 100 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    
    // Subtle rotation for liveliness
    foxRotate.value = withSequence(
      withTiming(-5, { duration: 80 }),
      withTiming(5, { duration: 80 }),
      withSpring(0, { damping: 10 })
    );
  }, [characterRow, characterCol, cellSize]);

  // Idle bounce animation
  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const foxAnimatedStyle = useAnimatedStyle(() => {
    const idleBounce = interpolate(bounce.value, [0, 1], [0, -3]);
    return {
      transform: [
        { translateX: foxX.value },
        { translateY: foxY.value + idleBounce },
        { scale: foxScale.value },
        { rotate: `${foxRotate.value}deg` },
      ],
    };
  });

  return (
    <View style={[styles.container, { width: cols * cellSize + 6, height: rows * cellSize + 6 }]}>
      <View style={styles.gridInner}>
        {grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c) => {
              const isWall = cell === CELL_TYPES.WALL;
              const isPath = cell === CELL_TYPES.PATH || cell === CELL_TYPES.START;
              const isGem = cell === CELL_TYPES.GEM;

              return (
                <View
                  key={c}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: CELL_BG[cell] || CELL_BG[CELL_TYPES.PATH],
                    },
                    isWall && styles.wallCell,
                    isPath && styles.pathCell,
                  ]}
                >
                  {isWall && (
                    <Text style={[styles.wallDecor, { fontSize: cellSize * 0.55 }]}>
                      {getWallDecor(r, c)}
                    </Text>
                  )}

                  {isPath && (
                    <View style={styles.grassDots}>
                      {(r + c) % 3 === 0 && <Text style={[styles.grassDot, { fontSize: cellSize * 0.18 }]}>🌱</Text>}
                      {(r + c) % 5 === 0 && <Text style={[styles.grassDot, { fontSize: cellSize * 0.16 }]}>🌼</Text>}
                    </View>
                  )}

                  {isGem ? (
                    <View style={styles.gemWrapper}>
                      <Text style={[styles.gemIcon, { fontSize: cellSize * 0.5 }]}>💎</Text>
                      <View style={[styles.gemGlow, { width: cellSize * 0.7, height: cellSize * 0.7, borderRadius: cellSize * 0.35 }]} />
                    </View>
                  ) : !isWall && !isPath && cell !== CELL_TYPES.START ? (
                    <Text style={[styles.cellIcon, { fontSize: cellSize * 0.5 }]}>
                      {CELL_ICONS[cell] || ''}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ))}
        
        {/* Animated Fox Character */}
        <Animated.View style={[styles.foxContainer, { width: cellSize, height: cellSize }, foxAnimatedStyle]}>
          <View style={[styles.foxShadow, { width: cellSize * 0.6, height: cellSize * 0.2, borderRadius: cellSize * 0.3 }]} />
          <View style={[styles.charCircle, { width: cellSize - 2, height: cellSize - 2 }]}>
            <View style={[styles.charGlow, { width: cellSize + 4, height: cellSize + 4, borderRadius: (cellSize + 4) / 2 }]} />
            <View style={[styles.charInnerRing, { width: cellSize - 8, height: cellSize - 8 }]}>
              <Text style={[styles.charEmoji, { fontSize: cellSize * 0.5 }]}>🦊</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#3D7A4A',
    backgroundColor: '#4A8B5C',
    padding: 2,
    ...SHADOWS.card,
  },
  gridInner: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row' },
  foxContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  foxShadow: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  wallCell: { 
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 4,
  },
  pathCell: { 
    borderColor: 'rgba(255,255,255,0.25)', 
    borderRadius: 6,
  },
  wallDecor: { 
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  grassDots: { position: 'absolute', top: 2, left: 2 },
  grassDot: { opacity: 0.6 },
  charCircle: {
    borderRadius: 999,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF8C5A',
    ...SHADOWS.card,
  },
  charGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 107, 53, 0.3)',
  },
  charInnerRing: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  charEmoji: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gemIcon: {
    textAlign: 'center',
    zIndex: 2,
    textShadowColor: 'rgba(168,85,247,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  gemGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(168,85,247,0.25)',
  },
  cellIcon: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
