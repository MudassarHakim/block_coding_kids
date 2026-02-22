import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { getProgressSummary, resetAllProgress, getIAPUnlocked, setIAPUnlocked } from '../../src/store/progressStore';
import ParentalGate from '../../src/components/ParentalGate';

export default function ParentZoneScreen() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [progress, setProgress] = useState(null);
  const [iapUnlocked, setIapState] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAuthenticated(false);
      setShowGate(false);
    }, [])
  );

  const handleEnter = () => setShowGate(true);

  const handleGatePass = async () => {
    setShowGate(false);
    setAuthenticated(true);
    const p = await getProgressSummary();
    setProgress(p);
    const iap = await getIAPUnlocked();
    setIapState(iap);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Progress',
      'This will delete all saved progress, badges, and streaks. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAllProgress();
            const p = await getProgressSummary();
            setProgress(p);
            Alert.alert('Done', 'All progress has been reset.');
          },
        },
      ]
    );
  };

  const handleUnlockAll = async () => {
    Alert.alert(
      'Unlock All Worlds',
      'This simulates an in-app purchase. In production, this would use the App Store / Google Play billing API.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock',
          onPress: async () => {
            await setIAPUnlocked(true);
            setIapState(true);
            Alert.alert('Unlocked!', 'All worlds are now available!');
          },
        },
      ]
    );
  };

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.gateContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.gateTitle}>Parent Zone</Text>
          <Text style={styles.gateDesc}>
            This area is for parents and guardians.{'\n'}
            Settings, purchases, and data controls are here.
          </Text>
          <TouchableOpacity style={styles.enterBtn} onPress={handleEnter}>
            <Text style={styles.enterText}>Enter Parent Zone</Text>
          </TouchableOpacity>
          <Text style={styles.gateNote}>A math question will verify you are an adult.</Text>
        </View>
        <ParentalGate
          visible={showGate}
          onPass={handleGatePass}
          onCancel={() => setShowGate(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🔓 Parent Zone</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>🛡️</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Zero Data Collection</Text>
              <Text style={styles.cardDesc}>
                BlockQuest Kids collects NO personal data. No accounts, no tracking, no analytics.
                All progress is stored locally on this device only.
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>🔇</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>No Social Features</Text>
              <Text style={styles.cardDesc}>
                No chat, no sharing, no user accounts. Kids play safely offline.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purchases</Text>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>🔑</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                Unlock All Worlds {iapUnlocked ? '✅' : ''}
              </Text>
              <Text style={styles.cardDesc}>
                {iapUnlocked
                  ? 'All worlds are unlocked! Your child has full access.'
                  : 'Remove level limits and unlock all 8 worlds immediately.'}
              </Text>
              {!iapUnlocked && (
                <TouchableOpacity style={styles.purchaseBtn} onPress={handleUnlockAll}>
                  <Text style={styles.purchaseText}>Unlock All — $4.99</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child's Progress</Text>
          {progress && (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.statsText}>Levels completed: {progress.completedCount}/200</Text>
                <Text style={styles.statsText}>Total stars: {progress.totalStars}</Text>
                <Text style={styles.statsText}>Current streak: {progress.streak?.count || 0} days</Text>
                <Text style={styles.statsText}>Badges earned: {progress.badges.length}</Text>
                <Text style={styles.statsText}>Worlds unlocked: {progress.unlockedWorlds.length}/8</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleResetProgress}>
            <Text style={styles.dangerText}>🗑 Reset All Progress</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>BlockQuest Kids v1.0.0</Text>
              <Text style={styles.cardDesc}>
                A block coding game designed to teach kids programming concepts through fun puzzles.
                No internet required. No data leaves this device.
              </Text>
              <Text style={[styles.cardDesc, { marginTop: 8 }]}>
                COPPA Compliant • No Ads in Gameplay • Kid-Safe
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { paddingHorizontal: SIZES.padding, paddingTop: 12 },
  gateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockIcon: { fontSize: 64, marginBottom: 16 },
  gateTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  gateDesc: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  enterBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 32,
    paddingVertical: 14,
    ...SHADOWS.button,
  },
  enterText: { fontSize: 17, fontWeight: '800', color: COLORS.textWhite },
  gateNote: { fontSize: 12, color: COLORS.textLight, marginTop: 16 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    ...SHADOWS.card,
  },
  cardIcon: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: COLORS.textLight, lineHeight: 19 },
  statsText: { fontSize: 14, color: COLORS.text, fontWeight: '500', marginBottom: 4 },
  purchaseBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusSm,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    ...SHADOWS.button,
  },
  purchaseText: { fontSize: 15, fontWeight: '800', color: COLORS.textWhite },
  dangerBtn: {
    backgroundColor: '#FDEDEC',
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
  },
  dangerText: { fontSize: 15, fontWeight: '700', color: COLORS.danger },
});
