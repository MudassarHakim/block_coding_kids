import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn, BounceIn } from 'react-native-reanimated';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const OBSTACLE_MESSAGES = {
  tree: { emoji: '🌲', title: 'Bumped into a tree!', hint: 'Watch out for trees and rocks!' },
  water: { emoji: '💧', title: 'Splashed into water!', hint: 'Foxy cannot swim!' },
  lava: { emoji: '🔥', title: 'Too hot!', hint: 'Stay away from the lava!' },
  boundary: { emoji: '🚧', title: 'Hit the edge!', hint: 'Stay inside the grid!' },
};

export default function LevelCompleteModal({ visible, result, onNext, onRetry, onClose }) {
  if (!result) return null;

  const { reachedGoal, starsCollected, totalStars, gemsCollected, totalGems, perfect, error, hitObstacle } = result;

  const stars = reachedGoal
    ? Math.min(3, 1 + (starsCollected === totalStars ? 1 : 0) + (perfect ? 1 : 0))
    : 0;

  const obstacleInfo = hitObstacle ? OBSTACLE_MESSAGES[hitObstacle] : null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.card}>
          {reachedGoal ? (
            <>
              <Animated.Text entering={BounceIn.delay(200)} style={styles.emoji}>
                {perfect ? '🎉' : '✅'}
              </Animated.Text>
              <Animated.Text entering={FadeInDown.delay(300)} style={styles.title}>
                {perfect ? 'Perfect!' : 'Level Complete!'}
              </Animated.Text>
              <Animated.View entering={FadeInUp.delay(400)} style={styles.starsRow}>
                {[1, 2, 3].map((i, idx) => (
                  <Animated.Text 
                    key={i} 
                    entering={ZoomIn.delay(500 + idx * 150).springify()}
                    style={[styles.star, i <= stars && styles.starActive]}
                  >
                    {i <= stars ? '⭐' : '☆'}
                  </Animated.Text>
                ))}
              </Animated.View>
              {(totalStars > 0 || totalGems > 0) && (
                <Animated.View entering={FadeIn.delay(600)} style={styles.statsContainer}>
                  {totalStars > 0 && (
                    <View style={styles.statBadge}>
                      <Text style={styles.statIcon}>⭐</Text>
                      <Text style={styles.stat}>{starsCollected}/{totalStars}</Text>
                    </View>
                  )}
                  {totalGems > 0 && (
                    <View style={styles.statBadge}>
                      <Text style={styles.statIcon}>💎</Text>
                      <Text style={styles.stat}>{gemsCollected}/{totalGems}</Text>
                    </View>
                  )}
                </Animated.View>
              )}
            </>
          ) : (
            <>
              <Animated.Text entering={BounceIn.delay(200)} style={styles.emoji}>
                {error ? '😅' : obstacleInfo ? obstacleInfo.emoji : '😅'}
              </Animated.Text>
              <Animated.Text entering={FadeInDown.delay(300)} style={styles.title}>
                {error ? 'Oops!' : obstacleInfo ? obstacleInfo.title : "Didn't reach the goal!"}
              </Animated.Text>
              {error && <Animated.Text entering={FadeIn.delay(400)} style={styles.errorText}>{error}</Animated.Text>}
              <Animated.Text entering={FadeIn.delay(400)} style={styles.hint}>
                {obstacleInfo ? obstacleInfo.hint : 'Try a different sequence!'}
              </Animated.Text>
            </>
          )}

          <Animated.View entering={FadeInUp.delay(500)} style={styles.buttons}>
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
              <Text style={styles.retryIcon}>↺</Text>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
            {reachedGoal && (
              <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.8}>
                <Text style={styles.nextText}>Next Level</Text>
                <Text style={styles.nextIcon}>→</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeText}>← Back to Levels</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 32,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    ...SHADOWS.cardHover,
  },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: COLORS.text, 
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  starsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  star: { fontSize: 44, color: COLORS.textLight },
  starActive: { 
    color: COLORS.accent,
    textShadowColor: 'rgba(251, 191, 36, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  statIcon: { fontSize: 18 },
  stat: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  errorText: { 
    fontSize: 14, 
    color: COLORS.danger, 
    marginBottom: 8, 
    textAlign: 'center',
    fontWeight: '600',
  },
  hint: { 
    fontSize: 15, 
    color: COLORS.textMedium, 
    marginBottom: 16, 
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  retryBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.card,
  },
  retryIcon: { fontSize: 20, color: COLORS.textMedium },
  retryText: { fontSize: 16, fontWeight: '700', color: COLORS.textMedium },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.buttonSuccess,
  },
  nextText: { fontSize: 16, fontWeight: '700', color: COLORS.textWhite },
  nextIcon: { fontSize: 18, color: COLORS.textWhite },
  closeBtn: { marginTop: 20, paddingVertical: 10 },
  closeText: { fontSize: 15, color: COLORS.textLight, fontWeight: '600' },
});
