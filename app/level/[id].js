import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { BLOCK_DEFS } from '../../src/constants/blocks';
import { generateAllLevels } from '../../src/engine/levelGenerator';
import { executeBlocks } from '../../src/engine/interpreter';
import { markLevelComplete } from '../../src/store/progressStore';
import Grid from '../../src/components/Grid';
import BlockPalette from '../../src/components/BlockPalette';
import BlockSequence from '../../src/components/BlockSequence';
import LevelCompleteModal from '../../src/components/LevelCompleteModal';

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
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>✕</Text>
      </TouchableOpacity>
      <View style={styles.titleArea}>
        <Text style={styles.levelLabel}>Level {level.id}</Text>
        <Text style={styles.levelTitle} numberOfLines={1}>{level.title}</Text>
      </View>
      <TouchableOpacity onPress={() => setShowHint(!showHint)} style={styles.hintBtn}>
        <Text style={styles.hintIcon}>💡</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActionBar = () => (
    <View style={styles.actionBar}>
      {isRunning ? (
        <TouchableOpacity style={[styles.actionBtn, styles.stopBtn]} onPress={stopAndReset}>
          <Text style={styles.actionText}>⏹ Stop</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={resetCode}>
            <Text style={[styles.actionText, styles.clearText]}>🗑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.runBtn, blocks.length === 0 && styles.disabledBtn]}
            onPress={runCode}
            disabled={blocks.length === 0}
          >
            <Text style={styles.actionText}>▶ Run</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
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
  safe: { flex: 1, backgroundColor: '#E8F4E5' },
  container: { flex: 1, paddingHorizontal: SIZES.padding },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  errorLink: { fontSize: 16, color: COLORS.primary, fontWeight: '700' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.card,
  },
  backText: { fontSize: 18, fontWeight: '700', color: '#9CA3AF' },
  titleArea: { flex: 1 },
  levelLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF' },
  levelTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  hintBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.card,
  },
  hintIcon: { fontSize: 18 },
  hintBar: {
    backgroundColor: '#FFF9E6',
    borderRadius: SIZES.radiusSm,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD93D',
  },
  hintText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },

  // Wide layout
  wideBody: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  codePanel: {
    flex: 4,
    minWidth: 260,
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    ...SHADOWS.card,
  },
  gridScene: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneFrame: {
    backgroundColor: '#D4EBC8',
    borderRadius: 16,
    padding: 10,
    borderWidth: 3,
    borderColor: '#8BB57A',
    ...SHADOWS.card,
  },
  sceneLabelRow: {
    marginTop: 10,
    alignItems: 'center',
  },
  sceneLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5B7A4A',
    backgroundColor: '#F0F9E8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // Narrow layout
  gridWrapper: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  sceneLabelSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B7A4A',
    marginTop: 6,
    backgroundColor: '#F0F9E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  codeArea: { flex: 1 },
  sequenceArea: { flex: 1, marginTop: 4 },

  actionBar: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  runBtn: { backgroundColor: '#6BCB77' },
  stopBtn: { backgroundColor: '#FF4757' },
  clearBtn: { backgroundColor: '#FFFFFF', flex: 0.35 },
  disabledBtn: { opacity: 0.45 },
  actionText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  clearText: { color: '#9CA3AF' },
});
