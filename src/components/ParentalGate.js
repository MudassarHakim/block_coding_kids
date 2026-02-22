import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

export default function ParentalGate({ visible, onPass, onCancel }) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const question = useMemo(() => {
    const a = Math.floor(Math.random() * 20) + 10;
    const b = Math.floor(Math.random() * 15) + 5;
    const ops = [
      { symbol: '+', result: a + b },
      { symbol: '−', result: a - b },
      { symbol: '×', result: Math.floor(a / 3) * Math.floor(b / 3) },
    ];
    const op = ops[Math.floor(Math.random() * ops.length)];
    if (op.symbol === '×') {
      const x = Math.floor(a / 3);
      const y = Math.floor(b / 3);
      return { text: `${x} × ${y}`, answer: x * y };
    }
    return { text: `${a} ${op.symbol} ${b}`, answer: op.result };
  }, [visible]);

  const handleSubmit = () => {
    if (parseInt(answer, 10) === question.answer) {
      setAnswer('');
      setError(false);
      onPass();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.title}>Parent Zone</Text>
          <Text style={styles.subtitle}>Solve this math problem to enter:</Text>
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>{question.text} = ?</Text>
          </View>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={answer}
            onChangeText={(t) => { setAnswer(t); setError(false); }}
            keyboardType="number-pad"
            placeholder="Your answer"
            placeholderTextColor={COLORS.textLight}
            maxLength={6}
            autoFocus
          />
          {error && <Text style={styles.errorText}>Try again!</Text>}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Enter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  lockIcon: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 16 },
  questionBox: {
    backgroundColor: COLORS.bg,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 16,
  },
  questionText: { fontSize: 28, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.gridLine,
    borderRadius: SIZES.radiusSm,
    padding: 12,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '700', color: COLORS.textLight },
  submitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  submitText: { fontSize: 16, fontWeight: '700', color: COLORS.textWhite },
});
