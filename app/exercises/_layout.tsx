import { Stack } from 'expo-router'; export default function ExerciseLayout(){return <Stack><Stack.Screen name="index" options={{title:'Exercise library'}}/><Stack.Screen name="new" options={{title:'Custom exercise'}}/><Stack.Screen name="[id]" options={{title:'Exercise'}}/><Stack.Screen name="adaptation" options={{title:'Personal adaptation'}}/></Stack>}

