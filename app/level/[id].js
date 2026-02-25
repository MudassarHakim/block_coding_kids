import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown, 
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { BLOCK_DEFS } from '../../src/constants/blocks';
import { generateAllLevels } from '../../src/engine/levelGenerator';
import { executeBlocks } from '../../src/engine/interpreter';
import { markLevelComplete } from '../../src/store/progressStore';
import Grid from '../../src/components/Grid';
import BlockPalette from '../../src/components/BlockPalette';
import BlockSequence from '../../src/components/BlockSequence';
import LevelCompleteModal from '../../src/components/LevelCompleteModal';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const allLevels = generateAllLevels();

let blockIdCounter = 0;

export default function LevelScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const isWide = SCREEN_W > 768;
  const levelId = parseInt(id, 10);
  const level = allLevels.find(l => l.id === levelId);

  const [blocks, setBlocks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [finishedState, setFinishedState] = useState(null);
  const animRef = useRef(null);
  const stepsRef = useRef([]);

  const currentState = useMemo(() => {
    if (isRunning && stepsRef.current[currentStep]) {
      return stepsRef.current[currentStep];
    }
    if (finishedState) return finishedState;
    if (!level) return null;
    return { row: level.startRow, col: level.startCol, dir: level.startDir ?? 0, grid: level.grid };
  }, [isRunning, currentStep, level, finishedState]);

  const addBlock = useCallback((type) => {
    if (blocks.length >= 20) return;
    setBlocks(prev => [...prev, { id: `block_${++blockIdCounter}`, type, param: BLOCK_DEFS[type]?.defaultParam }]);
  }, [blocks.length]);

  const removeBlock = useCallback((index) => {
    setBlocks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const moveBlock = useCallback((from, to) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      const [moved] = newBlocks.splice(from, 1);
      newBlocks.splice(to, 0, moved);
      return newBlocks;
    });
  }, []);

  const updateParam = useCallback((index, param) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      newBlocks[index] = { ...newBlocks[index], param };
      return newBlocks;
    });
  }, []);

  const runCode = useCallback(() => {
    if (!level || blocks.length === 0) return;
    const execResult = executeBlocks(blocks, level);
    stepsRef.current = execResult.steps;
    setResult(execResult);
    setCurrentStep(0);
    setIsRunning(true);
  }, [level, blocks]);

  useEffect(() => {
    if (!isRunning) return;
    const steps = stepsRef.current;
    if (currentStep < steps.length - 1) {
      animRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 350);
    } else {
      setFinishedState(stepsRef.current[stepsRef.current.length - 1]);
      setIsRunning(false);
      setShowModal(true);
      if (result?.reachedGoal) {
        const stars = Math.min(3, 1 + (result.starsCollected === result.totalStars ? 1 : 0) + (result.perfect ? 1 : 0));
        markLevelComplete(levelId, stars, result.perfect);
      }
    }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [isRunning, currentStep, result, levelId]);

  const resetCode = useCallback(() => {
    if (animRef.current) clearTimeout(animRef.current);
    setIsRunning(false);
    setCurrentStep(0);
    stepsRef.current = [];
    setResult(null);
    setShowModal(false);
    setFinishedState(null);
    setBlocks([]);
  }, []);

  const stopAndReset = useCallback(() => {
    if (animRef.current) clearTimeout(animRef.current);
    setIsRunning(false);
    setCurrentStep(0);
    stepsRef.current = [];
    setResult(null);
    setFinishedState(null);
  }, []);

  const handleNext = useCallback(() => {
    setShowModal(false);
    const nextLevel = allLevels.find(l => l.id === levelId + 1);
    if (nextLevel) {
      resetCode();
      router.replace(`/level/${nextLevel.id}`);
    } else {
      router.back();
    }
  }, [levelId, router, resetCode]);

  if (!level) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Level not found!</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.errorLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const gridMaxW = isWide ? SCREEN_W * 0.48 : SCREEN_W - 32;
  const codeWidth = isWide ? SCREEN_W * 0.46 : SCREEN_W - 32;

  const renderTopBar = () => (
    <Animated.View entering={SlideInDown.duration(400).springify()} style={styles.topBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <View style={styles.titleArea}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>Level {level.id}</Text>
        </View>
        <Text style={styles.levelTitle} numberOfLines={1}>{level.title}</Text>
      </View>
      <TouchableOpacity onPress={() => setShowHint(!showHint)} style={[styles.hintBtn, showHint && styles.hintBtnActive]} activeOpacity={0.7}>
        <Text style={styles.hintIcon}>💡</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderActionBar = () => (
    <Animated.View entering={SlideInDown.delay(200).duration(400).springify()} style={styles.actionBar}>
      {isRunning ? (
        <TouchableOpacity style={[styles.actionBtn, styles.stopBtn]} onPress={stopAndReset} activeOpacity={0.8}>
          <View style={styles.btnInner}>
            <Text style={styles.btnIcon}>⏹</Text>
            <Text style={styles.actionText}>Stop</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={resetCode} activeOpacity={0.8}>
            <Text style={styles.smallBtnIcon}>🗑️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.resetBtn]} onPress={stopAndReset} activeOpacity={0.8}>
            <Text style={styles.smallBtnIcon}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.runBtn, blocks.length === 0 && styles.disabledBtn]}
            onPress={runCode}
            disabled={blocks.length === 0}
            activeOpacity={0.8}
          >
            <View style={styles.btnInner}>
              <Text style={styles.btnIcon}>▶</Text>
              <Text style={styles.actionText}>Run Code</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );

  // --- WIDE / LANDSCAPE LAYOUT: Code left, Grid right ---
  if (isWide) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          {renderTopBar()}
          {showHint && (
            <View style={styles.hintBar}>
              <Text style={styles.hintText}>💡 {level.hint}</Text>
            </View>
          )}
          <View style={styles.wideBody}>
            {/* LEFT: Code panel */}
            <View style={styles.codePanel}>
              <BlockPalette availableBlocks={level.availableBlocks} onAddBlock={addBlock} vertical />
              <View style={styles.sequenceArea}>
                <BlockSequence blocks={blocks} onRemoveBlock={removeBlock} onMoveBlock={moveBlock} onUpdateParam={updateParam} maxBlocks={20} />
              </View>
              {renderActionBar()}
            </View>

            {/* RIGHT: Grid scene */}
            <View style={styles.gridScene}>
              <View style={styles.sceneFrame}>
                {currentState && (
                  <Grid
                    grid={currentState.grid}
                    characterRow={currentState.row}
                    characterCol={currentState.col}
                    characterDir={currentState.dir}
                    maxWidth={gridMaxW - 24}
                  />
                )}
              </View>
              <View style={styles.sceneLabelRow}>
                <Text style={styles.sceneLabel}>🦊 Help Foxy reach 🏠!</Text>
              </View>
            </View>
          </View>
        </View>
        <LevelCompleteModal visible={showModal} result={result} onNext={handleNext} onRetry={() => { setShowModal(false); stopAndReset(); }} onClose={() => { setShowModal(false); router.back(); }} />
      </SafeAreaView>
    );
  }

  // --- NARROW / PORTRAIT LAYOUT: Grid top, code bottom ---
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {renderTopBar()}
        {showHint && (
          <View style={styles.hintBar}>
            <Text style={styles.hintText}>💡 {level.hint}</Text>
          </View>
        )}

        <View style={styles.gridWrapper}>
          <View style={styles.sceneFrame}>
            {currentState && (
              <Grid
                grid={currentState.grid}
                characterRow={currentState.row}
                characterCol={currentState.col}
                characterDir={currentState.dir}
                maxWidth={gridMaxW}
              />
            )}
          </View>
          <Text style={styles.sceneLabelSmall}>🦊 Help Foxy reach 🏠!</Text>
        </View>

        <View style={styles.codeArea}>
          <BlockPalette availableBlocks={level.availableBlocks} onAddBlock={addBlock} />
          <View style={styles.sequenceArea}>
            <BlockSequence blocks={blocks} onRemoveBlock={removeBlock} onMoveBlock={moveBlock} onUpdateParam={updateParam} maxBlocks={20} />
          </View>
        </View>

        {renderActionBar()}
      </View>
      <LevelCompleteModal visible={showModal} result={result} onNext={handleNext} onRetry={() => { setShowModal(false); stopAndReset(); }} onClose={() => { setShowModal(false); router.back(); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#E8F5E9',
  },
  container: { flex: 1, paddingHorizontal: SIZES.padding },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  errorLink: { fontSize: 16, color: COLORS.primary, fontWeight: '700' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 44, 
    height: 44, 
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', 
    alignItems: 'center',
    ...SHADOWS.card,
  },
  backText: { fontSize: 22, fontWeight: '600', color: COLORS.textMedium },
  titleArea: { flex: 1 },
  levelBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  levelLabel: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  levelTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  hintBtn: {
    width: 44, 
    height: 44, 
    borderRadius: 14,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center', 
    alignItems: 'center',
    ...SHADOWS.card,
  },
  hintBtnActive: {
    backgroundColor: '#FFE082',
    transform: [{ scale: 1.05 }],
  },
  hintIcon: { fontSize: 22 },
  hintBar: {
    backgroundColor: '#FFFDE7',
    borderRadius: SIZES.radiusSm,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB300',
    ...SHADOWS.sm,
  },
  hintText: { 
    fontSize: 14, 
    color: COLORS.text, 
    fontWeight: '600',
    lineHeight: 20,
  },

  // Wide layout
  wideBody: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  codePanel: {
    flex: 4,
    minWidth: 280,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    ...SHADOWS.card,
  },
  gridScene: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneFrame: {
    backgroundColor: '#C8E6C9',
    borderRadius: 24,
    padding: 12,
    borderWidth: 4,
    borderColor: '#81C784',
    ...SHADOWS.cardHover,
  },
  sceneLabelRow: {
    marginTop: 14,
    alignItems: 'center',
  },
  sceneLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },

  // Narrow layout
  gridWrapper: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  sceneLabelSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 10,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  codeArea: { flex: 1 },
  sequenceArea: { flex: 1, marginTop: 6 },

  actionBar: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  smallBtnIcon: {
    fontSize: 20,
  },
  runBtn: { 
    backgroundColor: COLORS.success,
    ...SHADOWS.buttonSuccess,
  },
  stopBtn: { 
    backgroundColor: COLORS.danger,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  clearBtn: { 
    backgroundColor: '#FFFFFF', 
    flex: 0.25,
    ...SHADOWS.card,
  },
  resetBtn: { 
    backgroundColor: '#FFFFFF', 
    flex: 0.25,
    ...SHADOWS.card,
  },
  disabledBtn: { opacity: 0.5 },
  actionText: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
