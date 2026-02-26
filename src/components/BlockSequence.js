import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BLOCK_DEFS, BLOCK_TYPES } from '../constants/blocks';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const ARROW_ICONS = {
  move_up: 'arrow-up',
  move_down: 'arrow-down',
  move_left: 'arrow-back',
  move_right: 'arrow-forward',
};

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
                  {isArrow ? (
                    <>
                      <Text style={styles.pawSmall}>🐾</Text>
                      <View style={styles.arrowBadgeActive}>
                        <Ionicons 
                          name={ARROW_ICONS[block.type]} 
                          size={22} 
                          color={def.arrowColor} 
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.blockIcon}>{def.icon}</Text>
                      <Text style={styles.label} numberOfLines={1}>{def.label}</Text>
                    </>
                  )}
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
                    <Ionicons name="chevron-up" size={16} color={COLORS.textMedium} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoveDown(index)} style={styles.ctrlBtn} activeOpacity={0.7}>
                    <Ionicons name="chevron-down" size={16} color={COLORS.textMedium} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemove(index)} style={[styles.ctrlBtn, styles.removeBtn]} activeOpacity={0.7}>
                    <Ionicons name="close" size={16} color={COLORS.danger} />
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
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: COLORS.textMedium,
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  count: { 
    fontSize: 13, 
    color: COLORS.textLight, 
    fontWeight: '600',
    backgroundColor: COLORS.bg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    includeFontPadding: false,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24, gap: 10 },
  blockRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  block: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 10,
    ...SHADOWS.card,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  blockNumber: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockNumberText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '700',
    includeFontPadding: false,
  },
  pawSmall: { 
    fontSize: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
  },
  arrowBadgeActive: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockIcon: {
    fontSize: 18,
  },
  label: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    includeFontPadding: false,
  },
  paramControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    marginLeft: 4,
  },
  paramAdjustBtn: {
    minWidth: 36,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paramAdjustText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    includeFontPadding: false,
  },
  paramValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
    includeFontPadding: false,
  },
  controls: { flexDirection: 'row', gap: 6 },
  ctrlBtn: {
    width: 36, 
    height: 36, 
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', 
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  removeBtn: { backgroundColor: '#FEE2E2' },
  empty: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginTop: 12,
  },
  emptyIcon: { fontSize: 44, marginBottom: 16 },
  emptyText: { 
    fontSize: 16, 
    color: COLORS.textLight, 
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
    includeFontPadding: false,
  },
});
