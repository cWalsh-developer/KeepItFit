import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { api } from '@/lib/api';
import { cacheServerTemplates, localTemplates } from '@/lib/database';
import type { WorkoutTemplate } from '@/types/template';

export default function Templates() {
  const query = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      try {
        const remote = await api<WorkoutTemplate[]>('/templates');
        await cacheServerTemplates(remote);
        return remote;
      } catch {
        const local = await localTemplates();
        return local.map((row) => ({
          ...JSON.parse(row.payload), id: row.server_id ?? row.local_id, sync_status: row.sync_status,
        })) as WorkoutTemplate[];
      }
    },
  });
  return <Screen>
    <Link href="/templates/new" accessibilityRole="button" style={styles.newButton}>Create template</Link>
    {query.isLoading ? <ActivityIndicator accessibilityLabel="Loading templates" /> : query.data?.length ? query.data.map((item) =>
      <Link key={item.id} href={{ pathname: '/templates/[id]', params: { id: item.id } }} asChild>
        <Pressable accessibilityRole="button" style={styles.card}>
          <View style={{ flex: 1 }}><Text style={styles.name}>{item.name}</Text><Text>{item.exercises.length} exercises · about {item.estimated_minutes} minutes</Text></View>
          {item.sync_status && item.sync_status !== 'synced' ? <Text>Waiting to sync</Text> : null}
        </Pressable>
      </Link>) : <EmptyState title="No templates yet" body="Create an unlimited number of reusable workouts." />}
  </Screen>;
}
const styles = StyleSheet.create({newButton:{padding:17,textAlign:'center',backgroundColor:'#176B45',color:'white',borderRadius:14,fontWeight:'800'},card:{minHeight:76,padding:16,borderRadius:14,backgroundColor:'white',flexDirection:'row',alignItems:'center',gap:8},name:{fontSize:19,fontWeight:'800'}});
