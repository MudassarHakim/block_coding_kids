import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BLOCK_DEFS, BLOCK_TYPES } from '../constants/blocks';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

export default function BlockSequence({ blocks, onRemoveBlock, onMoveBlock, onUpdateParam, maxBlocks = 20 }) {
  const handleRemove = useCallback((index) => onRemoveBlock(index), [onRemoveBlock]);
  const handleMoveUp = useCallback((index) => { if (index > 0) onMoveBlock(index, index - 1); }, [onMoveBlock]);
  const handleMoveDown = useCallback((index) => { if (index < blocks.length - 1) onMoveBlock(index, index + 1); }, [onMoveBlock, blocks.length]);

  const cycleParam = useCallback((index) => {
    const block = blocks[index];
    if (block && BLOCK_DEFS[block.type]?.hasParam) {
      const current = block.param || 2;
      onUpdateParam(index, current >= 9 ? 2 : current + 1);
    }
  }, [blocks, onUpdateParam]);

  const getIndent = (index) => {
    let depth = 0;
    for (let i = 0; i < index; i++) {
      const t = blocks[i].type;
      if (t === BLOCK_TYPES.REPEAT || t === BLOCK_TYPES.IF_WALL || t === BLOCK_TYPES.IF_PATH || t === BLOCK_TYPES.IF_STAR) depth++;
      else if (t === BLOCK_TYPES.END_REPEAT || t === BLOCK_TYPES.END_IF) depth = Math.max(0, depth - 1);
      else if (t === BLOCK_TYPES.ELSE) { depth = Math.max(0, depth - 1); depth++; }
    }
    const t = blocks[index].type;
    if (t === BLOCK_TYPES.END_REPEAT || t === BLOCK_TYPES.END_IF || t === BLOCK_TYPES.ELSE) depth = Math.max(0, depth - 1);
    return depth;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Code</Text>
        <Text style={styles.count}>{blocks.length}/{maxBlocks}</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {blocks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👆</Text>
            <Text style={styles.emptyText}>Tap blocks above to add them here!</Text>
          </View>
        ) : (
          blocks.map((block, index) => {
            const def = BLOCK_DEFS[block.type];
            if (!def) return null;
            const indent = getIndent(index);
            const isArrow = def.category === 'movement';

            return (
              <View key={block.id} style={[styles.blockRow, { marginLeft: indent * 16 }]}>
                <View style={[styles.block, { backgroundColor: def.color }]}>
                  {isArrow && <Text style={styles.pawSmall}>🐾</Text>}
                  <View style={[styles.arrowBadge, isArrow && { backgroundColor: 'rgba(0,0,0,0.15)' }]}>
                    <Text style={[styles.arrowChar, isArrow && { color: def.arrowColor, fontSize: 18 }]}>
                      {def.arrowIcon || def.icon}
                    </Text>
                  </View>
                  {!isArrow && <Text style={styles.label} numberOfLines={1}>{def.label}</Text>}
                  {def.hasParam && (
                    <TouchableOpacity style={styles.paramBtn} onPress={() => cycleParam(index)}>
                      <Text style={styles.paramText}>{block.param || def.defaultParam}x</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.controls}>
                  <TouchableOpacity onPress={() => handleMoveUp(index)} style={styles.ctrlBtn}>
                    <Text style={styles.ctrlText}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoveDown(index)} style={styles.ctrlBtn}>
                    <Text style={styles.ctrlText}>▼</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemove(index)} style={[styles.ctrlBtn, styles.removeBtn]}>
                    <Text style={[styles.ctrlText, styles.removeText]}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  count: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20, gap: 5 },
  blockRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  block: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    ...SHADOWS.card,
  },
  pawSmall: { fontSize: 14 },
  arrowBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowChar: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  label: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  paramBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  paramText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  controls: { flexDirection: 'row', gap: 3 },
  ctrlBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center', alignItems: 'center',
  },
  ctrlText: { fontSize: 11, color: '#6B7280', fontWeight: '700' },
  removeBtn: { backgroundColor: '#FDEDEC' },
  removeText: { color: '#E74C3C' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30 },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
});
