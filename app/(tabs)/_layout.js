import { Tabs } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../../src/constants/theme';

function TabIcon({ icon, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🗺️" label="Quest" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🎨" label="Create" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏆" label="Progress" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="parent-zone"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🔒" label="Parents" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIcon: { fontSize: 24 },
  tabIconActive: { fontSize: 26 },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.tabInactive,
  },
  tabLabelActive: {
    color: COLORS.tabActive,
    fontWeight: '800',
  },
});
