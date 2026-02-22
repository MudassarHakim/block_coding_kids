import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CELL_TYPES } from '../constants/blocks';

const CELL_ICONS = {
  [CELL_TYPES.STAR]: '⭐',
  [CELL_TYPES.GEM]: '💎',
  [CELL_TYPES.WATER]: '💧',
  [CELL_TYPES.LAVA]: '🔥',
  [CELL_TYPES.GOAL]: '🏠',
  [CELL_TYPES.START]: '',
};

const CELL_BG = {
  [CELL_TYPES.PATH]: '#A8D5A2',
  [CELL_TYPES.WALL]: '#5B8C3E',
  [CELL_TYPES.STAR]: '#C8E6A0',
  [CELL_TYPES.GEM]: '#D4EAFF',
  [CELL_TYPES.WATER]: '#7EC8E3',
  [CELL_TYPES.LAVA]: '#E8785A',
  [CELL_TYPES.GOAL]: '#F5E6A3',
  [CELL_TYPES.START]: '#B5DFB0',
};

const WALL_DECOR = ['🌲', '🌳', '🌴', '🌵', '🪨'];

function getWallDecor(r, c) {
  return WALL_DECOR[(r * 7 + c * 13) % WALL_DECOR.length];
}

export default function Grid({ grid, characterRow, characterCol, cellSize: propCellSize, maxWidth }) {
  if (!grid || grid.length === 0) return null;

  const cols = grid[0].length;
  const rows = grid.length;
  const autoSize = maxWidth ? Math.floor((maxWidth - 8) / cols) : 44;
  const cellSize = Math.min(propCellSize || autoSize, 56);

  return (
    <View style={[styles.container, { width: cols * cellSize + 6, height: rows * cellSize + 6 }]}>
      {grid.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((cell, c) => {
            const isChar = r === characterRow && c === characterCol;
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

                {isPath && !isChar && (
                  <View style={styles.grassDots}>
                    {(r + c) % 3 === 0 && <Text style={[styles.grassDot, { fontSize: cellSize * 0.18 }]}>🌱</Text>}
                    {(r + c) % 5 === 0 && <Text style={[styles.grassDot, { fontSize: cellSize * 0.16 }]}>🌼</Text>}
                  </View>
                )}

                {isChar ? (
                  <View style={[styles.charWrapper, { width: cellSize, height: cellSize }]}>
                    <View style={[styles.charCircle, { width: cellSize - 4, height: cellSize - 4 }]}>
                      <View style={[styles.charInnerRing, { width: cellSize - 10, height: cellSize - 10 }]}>
                        <Text style={[styles.charEmoji, { fontSize: cellSize * 0.45 }]}>🦊</Text>
                      </View>
                    </View>
                  </View>
                ) : isGem ? (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#4A7C34',
    backgroundColor: '#6B9E4F',
    padding: 1,
  },
  row: { flexDirection: 'row' },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  wallCell: { borderColor: 'rgba(0,0,0,0.1)' },
  pathCell: { borderColor: 'rgba(255,255,255,0.15)', borderRadius: 2 },
  wallDecor: { textAlign: 'center' },
  grassDots: { position: 'absolute', top: 2, left: 2 },
  grassDot: { opacity: 0.5 },
  charWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  charCircle: {
    borderRadius: 999,
    backgroundColor: '#C0392B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  charInnerRing: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  charEmoji: {
    textAlign: 'center',
  },
  gemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gemIcon: {
    textAlign: 'center',
    zIndex: 2,
  },
  gemGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(100,180,255,0.2)',
  },
  cellIcon: {
    textAlign: 'center',
  },
});
