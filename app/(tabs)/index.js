import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { WORLDS } from '../../src/constants/worlds';
import { generateAllLevels } from '../../src/engine/levelGenerator';
import { getProgressSummary } from '../../src/store/progressStore';

const allLevels = generateAllLevels();
const { width: SCREEN_W } = Dimensions.get('window');

export default function DailyQuestScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [selectedWorld, setSelectedWorld] = useState(null);

  const loadProgress = useCallback(async () => {
    const p = await getProgressSummary();
    setProgress(p);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  const getDailyLevel = () => {
    if (!progress) return null;
    const nextLevel = allLevels.find(l => !progress.completedLevels.includes(l.id));
    return nextLevel || allLevels[0];
  };

  const dailyLevel = getDailyLevel();

  const renderWorldCard = (world) => {
    const isUnlocked = progress?.unlockedWorlds?.includes(world.id);
    const worldLevels = allLevels.filter(l => l.worldId === world.id);
    const completedInWorld = worldLevels.filter(l => progress?.completedLevels?.includes(l.id)).length;

    return (
      <TouchableOpacity
        key={world.id}
        style={[styles.worldCard, { backgroundColor: isUnlocked ? world.color : '#D5D8DC' }]}
        onPress={() => isUnlocked ? setSelectedWorld(world) : null}
        activeOpacity={isUnlocked ? 0.7 : 1}
      >
        <Text style={styles.worldIcon}>{isUnlocked ? world.icon : '🔒'}</Text>
        <View style={styles.worldInfo}>
          <Text style={styles.worldName}>{world.name}</Text>
          <Text style={styles.worldDesc}>{isUnlocked ? world.description : 'Complete more levels to unlock!'}</Text>
          {isUnlocked && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(completedInWorld / 25) * 100}%` }]} />
              <Text style={styles.progressText}>{completedInWorld}/25</Text>
            </View>
          )}
        </View>
        <Text style={styles.worldArrow}>{isUnlocked ? '▶' : ''}</Text>
      </TouchableOpacity>
    );
  };

  const renderLevelGrid = () => {
    if (!selectedWorld) return null;
    const worldLevels = allLevels.filter(l => l.worldId === selectedWorld.id);

    return (
      <View style={styles.levelGridContainer}>
        <View style={styles.levelGridHeader}>
          <TouchableOpacity onPress={() => setSelectedWorld(null)} style={styles.backBtn}>
            <Text style={styles.backText}>◀ Back</Text>
          </TouchableOpacity>
          <Text style={styles.levelGridTitle}>
            {selectedWorld.icon} {selectedWorld.name}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.levelGrid}>
          {worldLevels.map(level => {
            const isCompleted = progress?.completedLevels?.includes(level.id);
            const stars = progress?.starsPerLevel?.[level.id] || 0;
            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelBtn,
                  { backgroundColor: isCompleted ? selectedWorld.color : COLORS.card },
                  isCompleted && styles.levelBtnCompleted,
                ]}
                onPress={() => router.push(`/level/${level.id}`)}
              >
                <Text style={[styles.levelNum, isCompleted && styles.levelNumCompleted]}>
                  {level.id}
                </Text>
                <Text style={styles.levelTitle} numberOfLines={1}>{level.title}</Text>
                {isCompleted && (
                  <View style={styles.levelStars}>
                    {[1, 2, 3].map(i => (
                      <Text key={i} style={styles.levelStar}>
                        {i <= stars ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {selectedWorld ? renderLevelGrid() : (
          <>
            <View style={styles.header}>
              <Text style={styles.logo}>🧩 BlockQuest Kids</Text>
              {progress && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {progress.streak?.count || 0}</Text>
                </View>
              )}
            </View>

            {dailyLevel && (
              <TouchableOpacity
                style={styles.dailyCard}
                onPress={() => router.push(`/level/${dailyLevel.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.dailyBadge}>
                  <Text style={styles.dailyBadgeText}>TODAY'S QUEST</Text>
                </View>
                <Text style={styles.dailyTitle}>{dailyLevel.title}</Text>
                <Text style={styles.dailySubtitle}>
                  Level {dailyLevel.id} • {WORLDS.find(w => w.id === dailyLevel.worldId)?.name}
                </Text>
                <View style={styles.playBtn}>
                  <Text style={styles.playBtnText}>▶ Play Now!</Text>
                </View>
              </TouchableOpacity>
            )}

            <Text style={styles.sectionTitle}>Worlds</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.worldsList}>
              {WORLDS.map(renderWorldCard)}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: SIZES.padding },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logo: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  streakBadge: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  streakText: { color: COLORS.textWhite, fontWeight: '800', fontSize: 14 },
  dailyCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  dailyBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  dailyBadgeText: { color: COLORS.textWhite, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  dailyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textWhite, marginBottom: 4 },
  dailySubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  playBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radiusSm,
    paddingVertical: 12,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  playBtnText: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },
  worldsList: { paddingBottom: 20, gap: 10 },
  worldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: SIZES.radius,
    ...SHADOWS.card,
    gap: 12,
  },
  worldIcon: { fontSize: 36 },
  worldInfo: { flex: 1 },
  worldName: { fontSize: 17, fontWeight: '800', color: COLORS.textWhite },
  worldDesc: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  progressBar: {
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    marginTop: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  worldArrow: { fontSize: 20, color: 'rgba(255,255,255,0.8)' },
  levelGridContainer: { flex: 1 },
  levelGridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { paddingVertical: 6, paddingRight: 8 },
  backText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  levelGridTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 20,
  },
  levelBtn: {
    width: (SCREEN_W - SIZES.padding * 2 - 30) / 4,
    aspectRatio: 1,
    borderRadius: SIZES.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
    padding: 4,
  },
  levelBtnCompleted: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  levelNum: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  levelNumCompleted: { color: COLORS.textWhite },
  levelTitle: { fontSize: 8, color: COLORS.textLight, textAlign: 'center', marginTop: 2 },
  levelStars: { flexDirection: 'row', marginTop: 2 },
  levelStar: { fontSize: 10 },
});
