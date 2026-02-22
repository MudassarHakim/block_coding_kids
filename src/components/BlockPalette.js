import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BLOCK_DEFS } from '../constants/blocks';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

export default function BlockPalette({ availableBlocks, onAddBlock, vertical }) {
  if (vertical) {
    return (
      <View style={styles.vertContainer}>
        <Text style={styles.title}>Blocks</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.vertScroll}>
          {availableBlocks.map((type) => {
            const def = BLOCK_DEFS[type];
            if (!def) return null;
            const isArrow = def.category === 'movement';
            return (
              <TouchableOpacity
                key={type}
                style={[styles.vertBlock, { backgroundColor: def.color }]}
                onPress={() => onAddBlock(type)}
                activeOpacity={0.7}
              >
                {isArrow && <Text style={styles.pawIcon}>🐾</Text>}
                <View style={[styles.arrowBox, isArrow && { backgroundColor: 'rgba(0,0,0,0.15)' }]}>
                  <Text style={[styles.arrowText, isArrow && { color: def.arrowColor || '#FFF', fontSize: 20 }]}>
                    {def.arrowIcon || def.icon}
                  </Text>
                </View>
                {!isArrow && <Text style={styles.vertLabel} numberOfLines={1}>{def.label}</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blocks</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {availableBlocks.map((type) => {
          const def = BLOCK_DEFS[type];
          if (!def) return null;
          const isArrow = def.category === 'movement';
          return (
            <TouchableOpacity
              key={type}
              style={[styles.block, { backgroundColor: def.color }]}
              onPress={() => onAddBlock(type)}
              activeOpacity={0.7}
            >
              {isArrow && <Text style={styles.pawIcon}>🐾</Text>}
              <View style={[styles.arrowBox, isArrow && { backgroundColor: 'rgba(0,0,0,0.15)' }]}>
                <Text style={[styles.arrowText, isArrow && { color: def.arrowColor || '#FFF', fontSize: 22 }]}>
                  {def.arrowIcon || def.icon}
                </Text>
              </View>
              {!isArrow && <Text style={styles.label} numberOfLines={1}>{def.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 6 },
  vertContainer: { marginBottom: 8 },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 6,
    marginLeft: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scroll: { paddingHorizontal: 2, gap: 8 },
  vertScroll: { gap: 5 },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    ...SHADOWS.button,
    gap: 6,
    minWidth: 70,
  },
  vertBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    ...SHADOWS.card,
  },
  pawIcon: { fontSize: 16 },
  arrowBox: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  vertLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
});
