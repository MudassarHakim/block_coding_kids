import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  COMPLETED_LEVELS: '@bq_completed_levels',
  STARS_PER_LEVEL: '@bq_stars_per_level',
  STREAK: '@bq_streak',
  LAST_PLAY_DATE: '@bq_last_play_date',
  BADGES: '@bq_badges',
  UNLOCKED_WORLDS: '@bq_unlocked_worlds',
  TOTAL_STARS: '@bq_total_stars',
  IAP_UNLOCKED: '@bq_iap_unlocked',
};

export async function getCompletedLevels() {
  try {
    const data = await AsyncStorage.getItem(KEYS.COMPLETED_LEVELS);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export async function markLevelComplete(levelId, stars, perfect) {
  try {
    const completed = await getCompletedLevels();
    if (!completed.includes(levelId)) {
      completed.push(levelId);
      await AsyncStorage.setItem(KEYS.COMPLETED_LEVELS, JSON.stringify(completed));
    }

    const starsData = await getStarsPerLevel();
    const prev = starsData[levelId] || 0;
    if (stars > prev) {
      starsData[levelId] = stars;
      await AsyncStorage.setItem(KEYS.STARS_PER_LEVEL, JSON.stringify(starsData));
    }

    await updateStreak();
    await checkAndUnlockWorlds(completed.length);
    await checkBadges(completed, starsData);
  } catch (e) { console.warn('Failed to save progress:', e); }
}

export async function getStarsPerLevel() {
  try {
    const data = await AsyncStorage.getItem(KEYS.STARS_PER_LEVEL);
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
}

export async function getStreak() {
  try {
    const data = await AsyncStorage.getItem(KEYS.STREAK);
    return data ? JSON.parse(data) : { count: 0, lastDate: null };
  } catch { return { count: 0, lastDate: null }; }
}

async function updateStreak() {
  const streak = await getStreak();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (streak.lastDate === today) return;

  if (streak.lastDate === yesterday) {
    streak.count += 1;
  } else {
    streak.count = 1;
  }
  streak.lastDate = today;
  await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
}

export async function getBadges() {
  try {
    const data = await AsyncStorage.getItem(KEYS.BADGES);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

async function checkBadges(completed, starsData) {
  const badges = await getBadges();
  const totalStars = Object.values(starsData).reduce((a, b) => a + b, 0);
  const streak = await getStreak();

  const badgeDefs = [
    { id: 'first_step', name: 'First Step', icon: '👣', condition: () => completed.length >= 1 },
    { id: 'ten_levels', name: 'Explorer', icon: '🗺️', condition: () => completed.length >= 10 },
    { id: 'twenty_five', name: 'Adventurer', icon: '⚔️', condition: () => completed.length >= 25 },
    { id: 'fifty_levels', name: 'Champion', icon: '🏆', condition: () => completed.length >= 50 },
    { id: 'hundred_levels', name: 'Master Coder', icon: '👑', condition: () => completed.length >= 100 },
    { id: 'all_levels', name: 'Legend', icon: '🌟', condition: () => completed.length >= 200 },
    { id: 'star_collector', name: 'Star Collector', icon: '⭐', condition: () => totalStars >= 50 },
    { id: 'star_master', name: 'Star Master', icon: '🌠', condition: () => totalStars >= 200 },
    { id: 'streak_3', name: '3-Day Streak', icon: '🔥', condition: () => streak.count >= 3 },
    { id: 'streak_7', name: 'Weekly Warrior', icon: '💪', condition: () => streak.count >= 7 },
    { id: 'streak_30', name: 'Monthly Master', icon: '📅', condition: () => streak.count >= 30 },
    { id: 'world1_done', name: 'Grasslands Hero', icon: '🌿', condition: () => completed.filter(l => l >= 1 && l <= 25).length >= 25 },
    { id: 'world2_done', name: 'Ocean Explorer', icon: '🌊', condition: () => completed.filter(l => l >= 26 && l <= 50).length >= 25 },
    { id: 'world3_done', name: 'Desert Survivor', icon: '🏜️', condition: () => completed.filter(l => l >= 51 && l <= 75).length >= 25 },
    { id: 'loop_master', name: 'Loop Master', icon: '🔄', condition: () => completed.filter(l => l >= 51 && l <= 100).length >= 50 },
    { id: 'logic_pro', name: 'Logic Pro', icon: '🧠', condition: () => completed.filter(l => l >= 101 && l <= 150).length >= 50 },
  ];

  const newBadges = [...badges];
  for (const def of badgeDefs) {
    if (!newBadges.find(b => b.id === def.id) && def.condition()) {
      newBadges.push({ id: def.id, name: def.name, icon: def.icon, earnedAt: new Date().toISOString() });
    }
  }

  if (newBadges.length !== badges.length) {
    await AsyncStorage.setItem(KEYS.BADGES, JSON.stringify(newBadges));
  }
  return newBadges;
}

export async function getUnlockedWorlds() {
  try {
    const data = await AsyncStorage.getItem(KEYS.UNLOCKED_WORLDS);
    return data ? JSON.parse(data) : [1];
  } catch { return [1]; }
}

async function checkAndUnlockWorlds(completedCount) {
  const unlocked = await getUnlockedWorlds();
  const iap = await getIAPUnlocked();

  if (iap) {
    const all = [1, 2, 3, 4, 5, 6, 7, 8];
    await AsyncStorage.setItem(KEYS.UNLOCKED_WORLDS, JSON.stringify(all));
    return;
  }

  const thresholds = { 2: 15, 3: 35, 4: 60, 5: 85, 6: 110, 7: 135, 8: 165 };
  for (const [world, threshold] of Object.entries(thresholds)) {
    if (completedCount >= threshold && !unlocked.includes(Number(world))) {
      unlocked.push(Number(world));
    }
  }
  await AsyncStorage.setItem(KEYS.UNLOCKED_WORLDS, JSON.stringify(unlocked));
}

export async function getIAPUnlocked() {
  try {
    const data = await AsyncStorage.getItem(KEYS.IAP_UNLOCKED);
    return data === 'true';
  } catch { return false; }
}

export async function setIAPUnlocked(value) {
  await AsyncStorage.setItem(KEYS.IAP_UNLOCKED, value ? 'true' : 'false');
  if (value) {
    await AsyncStorage.setItem(KEYS.UNLOCKED_WORLDS, JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8]));
  }
}

export async function getProgressSummary() {
  const completed = await getCompletedLevels();
  const stars = await getStarsPerLevel();
  const streak = await getStreak();
  const badges = await getBadges();
  const worlds = await getUnlockedWorlds();
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  return {
    completedCount: completed.length,
    completedLevels: completed,
    starsPerLevel: stars,
    totalStars,
    streak,
    badges,
    unlockedWorlds: worlds,
    totalLevels: 200,
  };
}

export async function resetAllProgress() {
  for (const key of Object.values(KEYS)) {
    await AsyncStorage.removeItem(key);
  }
}
