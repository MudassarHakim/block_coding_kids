import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { BLOCK_DEFS } from '../constants/blocks';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function BlockPalette({ availableBlocks, onAddBlock, vertical }) {
  if (vertical) {
    return (
      <View style={styles.vertContainer}>
        <Text style={styles.title}>📦 Blocks</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.vertScroll}>
          {availableBlocks.map((type, index) => {
            const def = BLOCK_DEFS[type];
            if (!def) return null;
            const isArrow = def.category === 'movement';
            return (
              <AnimatedTouchable
                key={type}
                entering={FadeInDown.delay(index * 50).springify()}
                style={[styles.vertBlock, { backgroundColor: def.color }]}
                onPress={() => onAddBlock(type)}
                activeOpacity={0.8}
              >
                {isArrow && <Text style={styles.pawIcon}>🐾</Text>}
                <View style={[styles.arrowBox, isArrow && styles.arrowBoxActive]}>
                  <Text style={[styles.arrowText, isArrow && { color: def.arrowColor || '#FFF', fontSize: 22 }]}>
                    {def.arrowIcon || def.icon}
                  </Text>
                </View>
                {isArrow && <View style={styles.stepBadge}><Text style={styles.stepHint}>1</Text></View>}
                {!isArrow && <Text style={styles.vertLabel} numberOfLines={1}>{def.label}</Text>}
              </AnimatedTouchable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Blocks</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {availableBlocks.map((type, index) => {
          const def = BLOCK_DEFS[type];
          if (!def) return null;
          const isArrow = def.category === 'movement';
          return (
            <AnimatedTouchable
              key={type}
              entering={FadeInRight.delay(index * 60).springify()}
              style={[styles.block, { backgroundColor: def.color }]}
              onPress={() => onAddBlock(type)}
              activeOpacity={0.8}
            >
              {isArrow && <Text style={styles.pawIcon}>🐾</Text>}
              <View style={[styles.arrowBox, isArrow && styles.arrowBoxActive]}>
                <Text style={[styles.arrowText, isArrow && { color: def.arrowColor || '#FFF', fontSize: 24 }]}>
                  {def.arrowIcon || def.icon}
                </Text>
              </View>
              {isArrow && <View style={styles.stepBadge}><Text style={styles.stepHint}>1</Text></View>}
              {!isArrow && <Text style={styles.label} numberOfLines={1}>{def.label}</Text>}
            </AnimatedTouchable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  vertContainer: { marginBottom: 10 },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMedium,
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  scroll: { paddingHorizontal: 4, gap: 10 },
  vertScroll: { gap: 8 },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    minWidth: 80,
    ...SHADOWS.card,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  vertBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    ...SHADOWS.card,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pawIcon: { fontSize: 18 },
  arrowBox: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowBoxActive: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  arrowText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  vertLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  stepBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stepHint: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
