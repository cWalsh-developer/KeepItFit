import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { api } from '@/lib/api';
import { filterExercises } from '@/lib/exercises';
import type { Exercise } from '@/types/exercise';

export default function ExerciseLibrary() {
  const { favourites } = useLocalSearchParams<{ favourites?: string }>();
  const favouriteOnly = favourites === 'true';
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('');
  const query = useQuery({ queryKey: ['exercises', favouriteOnly], queryFn: () => api<Exercise[]>(favouriteOnly ? '/exercises/favourites' : '/exercises') });
  const groups = useMemo(() => [...new Set((query.data ?? []).map((x) => x.primary_muscle))].sort(), [query.data]);
  const shown = filterExercises(query.data ?? [], search, muscle);
  return <Screen>
    <View style={styles.actions}>
      <Link href="/exercises/new" accessibilityRole="button" style={styles.newButton}>Create custom</Link>
      <Link href={favouriteOnly ? '/exercises' : '/exercises?favourites=true'} accessibilityRole="button" style={styles.link}>{favouriteOnly ? 'All exercises' : 'Favourites'}</Link>
    </View>
    <TextInput accessibilityLabel="Search exercises" placeholder="Search exercises" value={search} onChangeText={setSearch} style={styles.search} />
    <View accessibilityLabel="Muscle group filters" style={styles.filters}>
      <Pressable onPress={() => setMuscle('')} style={[styles.chip, !muscle && styles.selected]}><Text>All</Text></Pressable>
      {groups.map((group) => <Pressable key={group} onPress={() => setMuscle(group)} style={[styles.chip, muscle === group && styles.selected]}><Text>{group}</Text></Pressable>)}
    </View>
    {query.isLoading ? <ActivityIndicator accessibilityLabel="Loading exercises" /> : query.isError ? <><Text accessibilityRole="alert">Exercises could not be loaded.</Text><Pressable accessibilityRole="button" onPress={() => void query.refetch()}><Text>Retry</Text></Pressable></> : shown.length === 0 ? <EmptyState title="No exercises found" body="Change the search or create a custom exercise." /> : shown.map((item) => <Link key={item.id} href={{ pathname: '/exercises/[id]', params: { id: item.id } }} asChild><Pressable accessibilityRole="button" accessibilityLabel={`${item.name}, ${item.primary_muscle}`} style={styles.card}><View style={{ flex: 1 }}><Text style={styles.name}>{item.name}</Text><Text>{item.primary_muscle} · {item.equipment}</Text></View><Text accessibilityLabel={item.unilateral ? 'Supports separate left and right logging' : 'Bilateral logging'}>{item.unilateral ? 'L / R' : 'Both'}</Text></Pressable></Link>)}
  </Screen>;
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 12 }, newButton: { backgroundColor: '#176B45', color: 'white', padding: 14, borderRadius: 12, fontWeight: '700' }, link: { padding: 14, color: '#176B45', fontWeight: '700' },
  search: { minHeight: 56, borderWidth: 2, borderColor: '#68766E', borderRadius: 12, padding: 12, fontSize: 18, backgroundColor: 'white' }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#68766E', borderRadius: 24 }, selected: { backgroundColor: '#CDEDDC', borderColor: '#176B45' },
  card: { minHeight: 72, padding: 16, borderRadius: 14, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', gap: 12 }, name: { fontSize: 18, fontWeight: '800', color: '#142019' },
});
