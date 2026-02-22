import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { WORLDS } from '../../src/constants/worlds';
import { getProgressSummary } from '../../src/store/progressStore';

const { width: SCREEN_W } = Dimensions.get('window');

export default function ProgressScreen() {
  const [progress, setProgress] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const p = await getProgressSummary();
        setProgress(p);
      })();
    }, [])
  );

  if (!progress) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}><Text>Loading...</Text></View>
      </SafeAreaView>
    );
  }

  const overallPercent = Math.round((progress.completedCount / progress.totalLevels) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🏆 My Progress</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.statValue}>{progress.completedCount}</Text>
            <Text style={styles.statLabel}>Levels Done</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.accent }]}>
            <Text style={[styles.statValue, { color: COLORS.text }]}>{progress.totalStars}</Text>
            <Text style={[styles.statLabel, { color: COLORS.text }]}>Total Stars</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.secondary }]}>
            <Text style={styles.statValue}>{progress.streak?.count || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.overallCard}>
          <Text style={styles.overallTitle}>Overall Progress</Text>
          <View style={styles.overallBar}>
            <View style={[styles.overallFill, { width: `${overallPercent}%` }]} />
          </View>
          <Text style={styles.overallText}>
            {progress.completedCount}/{progress.totalLevels} levels ({overallPercent}%)
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Worlds</Text>
        {WORLDS.map(world => {
          const worldLevels = Array.from({ length: 25 }, (_, i) => world.levelRange[0] + i);
          const completed = worldLevels.filter(id => progress.completedLevels.includes(id)).length;
          const pct = Math.round((completed / 25) * 100);
          const unlocked = progress.unlockedWorlds.includes(world.id);

          return (
            <View key={world.id} style={[styles.worldRow, !unlocked && styles.worldLocked]}>
              <Text style={styles.worldIcon}>{unlocked ? world.icon : '🔒'}</Text>
              <View style={styles.worldInfo}>
                <Text style={styles.worldName}>{world.name}</Text>
                <View style={styles.worldBar}>
                  <View style={[styles.worldFill, { width: `${pct}%`, backgroundColor: world.color }]} />
                </View>
                <Text style={styles.worldText}>{completed}/25 • {world.concept}</Text>
              </View>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Badges</Text>
        {progress.badges.length === 0 ? (
          <View style={styles.emptyBadges}>
            <Text style={styles.emptyIcon}>🎖️</Text>
            <Text style={styles.emptyText}>Complete levels to earn badges!</Text>
          </View>
        ) : (
          <View style={styles.badgeGrid}>
            {progress.badges.map(badge => (
              <View key={badge.id} style={styles.badgeCard}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { paddingHorizontal: SIZES.padding, paddingTop: 12 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    borderRadius: SIZES.radius,
    padding: 14,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  statValue: { fontSize: 28, fontWeight: '800', color: COLORS.textWhite },
  statLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  overallCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 18,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  overallTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  overallBar: {
    height: 20,
    backgroundColor: COLORS.gridBg,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 6,
  },
  overallFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  overallText: { fontSize: 13, color: COLORS.textLight, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  worldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    ...SHADOWS.card,
  },
  worldLocked: { opacity: 0.5 },
  worldIcon: { fontSize: 30 },
  worldInfo: { flex: 1 },
  worldName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  worldBar: {
    height: 10,
    backgroundColor: COLORS.gridBg,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 3,
  },
  worldFill: { height: '100%', borderRadius: 5 },
  worldText: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
  emptyBadges: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 28,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.textLight },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: (SCREEN_W - SIZES.padding * 2 - 20) / 3,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
    padding: 14,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  badgeIcon: { fontSize: 32, marginBottom: 6 },
  badgeName: { fontSize: 11, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
});
