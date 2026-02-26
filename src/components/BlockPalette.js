import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BLOCK_DEFS } from '../constants/blocks';
import { COLORS, SHADOWS } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.View;

const ARROW_ICONS = {
  up: 'arrow-up',
  down: 'arrow-down', 
  left: 'arrow-back',
  right: 'arrow-forward',
};

function AnimatedArrow({ direction, color }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const offset = 4;
    const duration = 700;
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    switch (direction) {
      case 'up':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-offset, { duration, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        break;
      case 'down':
        translateY.value = withRepeat(
          withSequence(
            withTiming(offset, { duration, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        break;
      case 'left':
        translateX.value = withRepeat(
          withSequence(
            withTiming(-offset, { duration, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        break;
      case 'right':
        translateX.value = withRepeat(
          withSequence(
            withTiming(offset, { duration, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        break;
    }
  }, [direction]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <AnimatedView style={[styles.arrowBox, animatedStyle]}>
      <Ionicons name={ARROW_ICONS[direction]} size={28} color={color} />
    </AnimatedView>
  );
}

function getDirection(type) {
  if (type.includes('up')) return 'up';
  if (type.includes('down')) return 'down';
  if (type.includes('left')) return 'left';
  if (type.includes('right')) return 'right';
  return null;
}

export default function BlockPalette({ availableBlocks, onAddBlock, vertical }) {
  const renderBlock = (type, index, isVertical) => {
    const def = BLOCK_DEFS[type];
    if (!def) return null;
    const isMovement = def.category === 'movement';
    const direction = getDirection(type);
    
    return (
      <AnimatedTouchable
        key={type}
        entering={isVertical ? FadeInDown.delay(index * 50).springify() : FadeInRight.delay(index * 60).springify()}
        style={[isVertical ? styles.vertBlock : styles.block, { backgroundColor: def.color }]}
        onPress={() => onAddBlock(type)}
        activeOpacity={0.8}
      >
        {isMovement && direction ? (
          <>
            <Text style={styles.pawIcon}>🐾</Text>
            <AnimatedArrow direction={direction} color={def.arrowColor} />
            <View style={styles.stepBadge}>
              <Text style={styles.stepText}>1</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.blockIcon}>{def.icon}</Text>
            <Text style={isVertical ? styles.vertLabel : styles.label} numberOfLines={1}>{def.label}</Text>
          </>
        )}
      </AnimatedTouchable>
    );
  };

  if (vertical) {
    return (
      <View style={styles.vertContainer}>
        <Text style={styles.title}>📦 Blocks</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.vertScroll}>
          {availableBlocks.map((type, index) => renderBlock(type, index, true))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Blocks</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {availableBlocks.map((type, index) => renderBlock(type, index, false))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  vertContainer: { marginBottom: 12 },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMedium,
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  scroll: { 
    paddingHorizontal: 4, 
    gap: 12,
  },
  vertScroll: { 
    gap: 12,
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    ...SHADOWS.card,
  },
  vertBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    ...SHADOWS.card,
  },
  pawIcon: {
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    width: 28,
    height: 28,
    textAlign: 'center',
    lineHeight: 28,
    overflow: 'hidden',
  },
  arrowBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    includeFontPadding: false,
  },
  blockIcon: { 
    fontSize: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    includeFontPadding: false,
  },
  vertLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    includeFontPadding: false,
  },
});
