import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import { BLOCK_DEFS, BLOCK_TYPES } from '../constants/blocks';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const AnimatedView = Animated.View;

export default function BlockSequence({ blocks, onRemoveBlock, onMoveBlock, onUpdateParam, maxBlocks = 20 }) {
  const handleRemove = useCallback((index) => onRemoveBlock(index), [onRemoveBlock]);
  const handleMoveUp = useCallback((index) => { if (index > 0) onMoveBlock(index, index - 1); }, [onMoveBlock]);
  const handleMoveDown = useCallback((index) => { if (index < blocks.length - 1) onMoveBlock(index, index + 1); }, [onMoveBlock, blocks.length]);

  const increaseParam = useCallback((index) => {
    const block = blocks[index];
    if (block && BLOCK_DEFS[block.type]?.hasParam) {
      const current = block.param || 1;
      if (current < 9) onUpdateParam(index, current + 1);
    }
  }, [blocks, onUpdateParam]);

  const decreaseParam = useCallback((index) => {
    const block = blocks[index];
    if (block && BLOCK_DEFS[block.type]?.hasParam) {
      const current = block.param || 1;
      if (current > 1) onUpdateParam(index, current - 1);
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
              <AnimatedView 
                key={block.id} 
                entering={FadeInRight.springify().damping(15)}
                exiting={FadeOutLeft.duration(200)}
                layout={Layout.springify().damping(15)}
                style={[styles.blockRow, { marginLeft: indent * 18 }]}
              >
                <View style={[styles.block, { backgroundColor: def.color }]}>
                  <View style={styles.blockNumber}>
                    <Text style={styles.blockNumberText}>{index + 1}</Text>
                  </View>
                  {isArrow && <Text style={styles.pawSmall}>🐾</Text>}
                  <View style={[styles.arrowBadge, isArrow && styles.arrowBadgeActive]}>
                    <Text style={[styles.arrowChar, isArrow && { color: def.arrowColor, fontSize: 20 }]}>
                      {def.arrowIcon || def.icon}
                    </Text>
                  </View>
                  {!isArrow && <Text style={styles.label} numberOfLines={1}>{def.label}</Text>}
                  {def.hasParam && (
                    <View style={styles.paramControls}>
                      <TouchableOpacity style={styles.paramAdjustBtn} onPress={() => decreaseParam(index)} activeOpacity={0.7}>
                        <Text style={styles.paramAdjustText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.paramValue}>{block.param || def.defaultParam}</Text>
                      <TouchableOpacity style={styles.paramAdjustBtn} onPress={() => increaseParam(index)} activeOpacity={0.7}>
                        <Text style={styles.paramAdjustText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={styles.controls}>
                  <TouchableOpacity onPress={() => handleMoveUp(index)} style={styles.ctrlBtn} activeOpacity={0.7}>
                    <Text style={styles.ctrlText}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoveDown(index)} style={styles.ctrlBtn} activeOpacity={0.7}>
                    <Text style={styles.ctrlText}>▼</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemove(index)} style={[styles.ctrlBtn, styles.removeBtn]} activeOpacity={0.7}>
                    <Text style={[styles.ctrlText, styles.removeText]}>✕</Text>
                  </TouchableOpacity>
                </View>
              </AnimatedView>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  title: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: COLORS.textMedium,
    letterSpacing: 0.3,
  },
  count: { 
    fontSize: 12, 
    color: COLORS.textLight, 
    fontWeight: '700',
    backgroundColor: COLORS.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24, gap: 8 },
  blockRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  block: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    ...SHADOWS.card,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  blockNumber: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockNumberText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '800',
  },
  pawSmall: { fontSize: 16 },
  arrowBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowBadgeActive: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  arrowChar: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  paramControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    marginLeft: 4,
  },
  paramAdjustBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  paramAdjustText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  paramValue: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  controls: { flexDirection: 'row', gap: 4 },
  ctrlBtn: {
    width: 30, 
    height: 30, 
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', 
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  ctrlText: { fontSize: 12, color: COLORS.textMedium, fontWeight: '700' },
  removeBtn: { backgroundColor: '#FEE2E2' },
  removeText: { color: COLORS.danger },
  empty: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginTop: 10,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { 
    fontSize: 15, 
    color: COLORS.textLight, 
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
});
