import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { BLOCK_TYPES, BLOCK_DEFS, CELL_TYPES } from '../../src/constants/blocks';
import { executeBlocks } from '../../src/engine/interpreter';
import Grid from '../../src/components/Grid';
import BlockPalette from '../../src/components/BlockPalette';
import BlockSequence from '../../src/components/BlockSequence';

const GRID_SIZES = [
  { label: '5x5', rows: 5, cols: 5 },
  { label: '6x6', rows: 6, cols: 6 },
  { label: '7x7', rows: 7, cols: 7 },
  { label: '8x8', rows: 8, cols: 8 },
];

const ALL_BLOCKS = [
  BLOCK_TYPES.MOVE_UP, BLOCK_TYPES.MOVE_DOWN, BLOCK_TYPES.MOVE_LEFT, BLOCK_TYPES.MOVE_RIGHT,
  BLOCK_TYPES.REPEAT, BLOCK_TYPES.END_REPEAT,
  BLOCK_TYPES.IF_WALL, BLOCK_TYPES.IF_PATH, BLOCK_TYPES.ELSE, BLOCK_TYPES.END_IF,
];

let blockIdCounter = 1000;

function createEmptyGrid(rows, cols) {
  const grid = [];
  for (let r = 0; r < rows + 2; r++) {
    const row = [];
    for (let c = 0; c < cols + 2; c++) {
      if (r === 0 || r === rows + 1 || c === 0 || c === cols + 1) {
        row.push(CELL_TYPES.WALL);
      } else {
        row.push(CELL_TYPES.PATH);
      }
    }
    grid.push(row);
  }
  grid[1][1] = CELL_TYPES.START;
  grid[rows][cols] = CELL_TYPES.GOAL;
  return grid;
}

function getCellColor(cell) {
  return {
    [CELL_TYPES.PATH]: '#A8D5A2',
    [CELL_TYPES.WALL]: '#5B8C3E',
    [CELL_TYPES.STAR]: '#C8E6A0',
    [CELL_TYPES.GEM]: '#B8DAF0',
    [CELL_TYPES.WATER]: '#7EC8E3',
    [CELL_TYPES.LAVA]: '#E8785A',
    [CELL_TYPES.GOAL]: '#F5E6A3',
    [CELL_TYPES.START]: '#B5DFB0',
  }[cell] || '#A8D5A2';
}

function getCellEmoji(cell) {
  return {
    [CELL_TYPES.WALL]: '🌲',
    [CELL_TYPES.STAR]: '⭐',
    [CELL_TYPES.GEM]: '💎',
    [CELL_TYPES.GOAL]: '🏠',
    [CELL_TYPES.START]: '🦊',
  }[cell] || '';
}

export default function CreateScreen() {
  const { width: SCREEN_W } = useWindowDimensions();
  const isWide = SCREEN_W > 768;

  const [gridSizeIdx, setGridSizeIdx] = useState(0);
  const [grid, setGrid] = useState(() => createEmptyGrid(5, 5));
  const [editMode, setEditMode] = useState('play');
  const [paintTool, setPaintTool] = useState(CELL_TYPES.WALL);
  const [blocks, setBlocks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const animRef = useRef(null);
  const stepsRef = useRef([]);

  const startPos = useMemo(() => {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === CELL_TYPES.START) return { row: r, col: c };
      }
    }
    return { row: 1, col: 1 };
  }, [grid]);

  const level = useMemo(() => ({
    grid, startRow: startPos.row, startCol: startPos.col, startDir: 1,
  }), [grid, startPos]);

  const [finishedState, setFinishedState] = useState(null);

  const currentState = useMemo(() => {
    if (isRunning && stepsRef.current[currentStep]) return stepsRef.current[currentStep];
    if (finishedState) return finishedState;
    return { row: level.startRow, col: level.startCol, dir: 1, grid };
  }, [isRunning, currentStep, level, grid, finishedState]);

  const changeGridSize = (idx) => {
    setGridSizeIdx(idx);
    setGrid(createEmptyGrid(GRID_SIZES[idx].rows, GRID_SIZES[idx].cols));
    stopRun();
  };

  const handleCellPress = (r, c) => {
    if (editMode !== 'edit') return;
    if (r === 0 || r === grid.length - 1 || c === 0 || c === grid[0].length - 1) return;
    setGrid(prev => {
      const ng = prev.map(row => [...row]);
      ng[r][c] = ng[r][c] === paintTool ? CELL_TYPES.PATH : paintTool;
      return ng;
    });
  };

  const addBlock = useCallback((type) => {
    if (blocks.length >= 20) return;
    setBlocks(prev => [...prev, { id: `cblock_${++blockIdCounter}`, type, param: BLOCK_DEFS[type]?.defaultParam }]);
  }, [blocks.length]);
  const removeBlock = useCallback((i) => setBlocks(p => p.filter((_, j) => j !== i)), []);
  const moveBlock = useCallback((from, to) => {
    setBlocks(prev => { const n = [...prev]; const [m] = n.splice(from, 1); n.splice(to, 0, m); return n; });
  }, []);
  const updateParam = useCallback((i, param) => {
    setBlocks(prev => { const n = [...prev]; n[i] = { ...n[i], param }; return n; });
  }, []);

  const runCode = useCallback(() => {
    if (blocks.length === 0) return;
    const r = executeBlocks(blocks, level);
    stepsRef.current = r.steps; setResult(r); setCurrentStep(0); setIsRunning(true);
  }, [blocks, level]);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep < stepsRef.current.length - 1) {
      animRef.current = setTimeout(() => setCurrentStep(p => p + 1), 350);
    } else { setFinishedState(stepsRef.current[stepsRef.current.length - 1]); setIsRunning(false); }
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [isRunning, currentStep]);

  const stopRun = () => {
    if (animRef.current) clearTimeout(animRef.current);
    setIsRunning(false); setCurrentStep(0); stepsRef.current = []; setResult(null); setFinishedState(null);
  };

  const PAINT_TOOLS = [
    { type: CELL_TYPES.WALL, label: '🌲 Tree' },
    { type: CELL_TYPES.STAR, label: '⭐ Star' },
    { type: CELL_TYPES.GEM, label: '💎 Gem' },
    { type: CELL_TYPES.GOAL, label: '🏠 Home' },
    { type: CELL_TYPES.START, label: '🦊 Foxy' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎨 Create Mode</Text>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, editMode === 'edit' && styles.tabActive]} onPress={() => { setEditMode('edit'); stopRun(); }}>
              <Text style={[styles.tabText, editMode === 'edit' && styles.tabTextActive]}>Build Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, editMode === 'play' && styles.tabActive]} onPress={() => setEditMode('play')}>
              <Text style={[styles.tabText, editMode === 'play' && styles.tabTextActive]}>Code It</Text>
            </TouchableOpacity>
          </View>
        </View>

        {editMode === 'edit' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.sizeRow}>
              {GRID_SIZES.map((s, i) => (
                <TouchableOpacity key={i} style={[styles.sizeBtn, gridSizeIdx === i && styles.sizeBtnActive]} onPress={() => changeGridSize(i)}>
                  <Text style={[styles.sizeText, gridSizeIdx === i && styles.sizeTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolRow}>
              {PAINT_TOOLS.map(tool => (
                <TouchableOpacity key={tool.type} style={[styles.toolBtn, paintTool === tool.type && styles.toolBtnActive]} onPress={() => setPaintTool(tool.type)}>
                  <Text style={styles.toolText}>{tool.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.editGridWrapper}>
              <View style={styles.editGrid}>
                {grid.map((row, r) => (
                  <View key={r} style={styles.editRow}>
                    {row.map((cell, c) => (
                      <TouchableOpacity key={c} style={[styles.editCell, { width: Math.min(44, (SCREEN_W - 48) / grid[0].length), height: Math.min(44, (SCREEN_W - 48) / grid[0].length), backgroundColor: getCellColor(cell) }]} onPress={() => handleCellPress(r, c)}>
                        <Text style={styles.editCellText}>{getCellEmoji(cell)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.editHint}>Tap tiles to place trees, stars, and more!</Text>
          </ScrollView>
        ) : (
          <View style={isWide ? styles.widePlay : styles.playArea}>
            {isWide ? (
              <>
                <View style={styles.codePanelCreate}>
                  <BlockPalette availableBlocks={ALL_BLOCKS} onAddBlock={addBlock} vertical />
                  <View style={styles.sequenceArea}>
                    <BlockSequence blocks={blocks} onRemoveBlock={removeBlock} onMoveBlock={moveBlock} onUpdateParam={updateParam} />
                  </View>
                  <View style={styles.actionBar}>
                    <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={() => { setBlocks([]); stopRun(); }}>
                      <Text style={[styles.actionText, styles.clearText]}>🗑</Text>
                    </TouchableOpacity>
                    {isRunning ? (
                      <TouchableOpacity style={[styles.actionBtn, styles.stopBtn]} onPress={stopRun}><Text style={styles.actionText}>⏹ Stop</Text></TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={[styles.actionBtn, styles.runBtn, blocks.length === 0 && styles.disabledBtn]} onPress={runCode} disabled={blocks.length === 0}><Text style={styles.actionText}>▶ Run</Text></TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={styles.gridSceneCreate}>
                  <View style={styles.sceneFrame}>
                    {currentState && <Grid grid={currentState.grid} characterRow={currentState.row} characterCol={currentState.col} characterDir={currentState.dir} maxWidth={SCREEN_W * 0.48} />}
                  </View>
                  {result && !isRunning && (
                    <Text style={[styles.resultText, result.reachedGoal ? styles.resultSuccess : styles.resultFail]}>
                      {result.reachedGoal ? '🎉 Foxy made it home!' : '😅 Try again!'}
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.gridWrapper}>
                  <View style={styles.sceneFrame}>
                    {currentState && <Grid grid={currentState.grid} characterRow={currentState.row} characterCol={currentState.col} characterDir={currentState.dir} maxWidth={SCREEN_W - 48} />}
                  </View>
                  {result && !isRunning && (
                    <Text style={[styles.resultText, result.reachedGoal ? styles.resultSuccess : styles.resultFail]}>
                      {result.reachedGoal ? '🎉 Foxy made it home!' : '😅 Try again!'}
                    </Text>
                  )}
                </View>
                <View style={styles.codeArea}>
                  <BlockPalette availableBlocks={ALL_BLOCKS} onAddBlock={addBlock} />
                  <View style={styles.sequenceArea}>
                    <BlockSequence blocks={blocks} onRemoveBlock={removeBlock} onMoveBlock={moveBlock} onUpdateParam={updateParam} />
                  </View>
                </View>
                <View style={styles.actionBar}>
                  <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={() => { setBlocks([]); stopRun(); }}>
                    <Text style={[styles.actionText, styles.clearText]}>🗑</Text>
                  </TouchableOpacity>
                  {isRunning ? (
                    <TouchableOpacity style={[styles.actionBtn, styles.stopBtn]} onPress={stopRun}><Text style={styles.actionText}>⏹ Stop</Text></TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={[styles.actionBtn, styles.runBtn, blocks.length === 0 && styles.disabledBtn]} onPress={runCode} disabled={blocks.length === 0}><Text style={styles.actionText}>▶ Run</Text></TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E8F4E5' },
  container: { flex: 1, paddingHorizontal: SIZES.padding },
  header: { paddingTop: 8, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', ...SHADOWS.card },
  tabActive: { backgroundColor: '#6BCB77' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  tabTextActive: { color: '#FFFFFF' },
  sizeRow: { flexDirection: 'row', gap: 8, marginVertical: 10 },
  sizeBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center' },
  sizeBtnActive: { backgroundColor: '#6BCB77' },
  sizeText: { fontSize: 13, fontWeight: '700', color: '#9CA3AF' },
  sizeTextActive: { color: '#FFFFFF' },
  toolRow: { gap: 8, paddingVertical: 8 },
  toolBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#FFFFFF', ...SHADOWS.card },
  toolBtnActive: { backgroundColor: '#FFD93D' },
  toolText: { fontSize: 13, fontWeight: '700' },
  editGridWrapper: { alignItems: 'center', paddingVertical: 12 },
  editGrid: { borderRadius: 12, overflow: 'hidden', borderWidth: 3, borderColor: '#8BB57A' },
  editRow: { flexDirection: 'row' },
  editCell: { justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.06)' },
  editCellText: { fontSize: 18 },
  editHint: { fontSize: 13, color: '#7A9C6A', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  playArea: { flex: 1 },
  widePlay: { flex: 1, flexDirection: 'row', gap: 16 },
  codePanelCreate: { flex: 0.45, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, ...SHADOWS.card },
  gridSceneCreate: { flex: 0.55, justifyContent: 'center', alignItems: 'center' },
  sceneFrame: { backgroundColor: '#D4EBC8', borderRadius: 16, padding: 10, borderWidth: 3, borderColor: '#8BB57A', ...SHADOWS.card },
  gridWrapper: { alignItems: 'center', paddingVertical: 6 },
  resultText: { marginTop: 8, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  resultSuccess: { color: '#6BCB77' },
  resultFail: { color: '#FF4757' },
  codeArea: { flex: 1 },
  sequenceArea: { flex: 1, marginTop: 4 },
  actionBar: { flexDirection: 'row', gap: 10, paddingVertical: 8 },
  actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', ...SHADOWS.button },
  runBtn: { backgroundColor: '#6BCB77' },
  stopBtn: { backgroundColor: '#FF4757' },
  clearBtn: { backgroundColor: '#FFFFFF', flex: 0.3 },
  disabledBtn: { opacity: 0.45 },
  actionText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  clearText: { color: '#9CA3AF' },
});
