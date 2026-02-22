import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

export default function LevelCompleteModal({ visible, result, onNext, onRetry, onClose }) {
  if (!result) return null;

  const { reachedGoal, starsCollected, totalStars, gemsCollected, totalGems, perfect, error } = result;

  const stars = reachedGoal
    ? Math.min(3, 1 + (starsCollected === totalStars ? 1 : 0) + (perfect ? 1 : 0))
    : 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {reachedGoal ? (
            <>
              <Text style={styles.emoji}>{perfect ? '🎉' : '✅'}</Text>
              <Text style={styles.title}>{perfect ? 'Perfect!' : 'Level Complete!'}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3].map(i => (
                  <Text key={i} style={[styles.star, i <= stars && styles.starActive]}>
                    {i <= stars ? '⭐' : '☆'}
                  </Text>
                ))}
              </View>
              {totalStars > 0 && (
                <Text style={styles.stat}>Stars: {starsCollected}/{totalStars}</Text>
              )}
              {totalGems > 0 && (
                <Text style={styles.stat}>Gems: {gemsCollected}/{totalGems} 💎</Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.emoji}>😅</Text>
              <Text style={styles.title}>
                {error ? 'Oops!' : "Didn't reach the goal!"}
              </Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <Text style={styles.hint}>Try a different sequence!</Text>
            </>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
              <Text style={styles.retryText}>🔄 Try Again</Text>
            </TouchableOpacity>
            {reachedGoal && (
              <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
                <Text style={styles.nextText}>Next ▶</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Back to Levels</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  star: { fontSize: 36, color: COLORS.textLight },
  starActive: { color: COLORS.accent },
  stat: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  errorText: { fontSize: 14, color: COLORS.danger, marginBottom: 8, textAlign: 'center' },
  hint: { fontSize: 14, color: COLORS.textLight, marginBottom: 12, textAlign: 'center' },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    width: '100%',
  },
  retryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  retryText: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  nextBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  nextText: { fontSize: 16, fontWeight: '700', color: COLORS.textWhite },
  closeBtn: { marginTop: 14, paddingVertical: 8 },
  closeText: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
});
