import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { 
  useFonts,
  Inter_400Regular,
  Inter_700Bold
} from '@expo-google-fonts/inter'
import { theme } from './src/theme';
import { HomeScreen } from './src/screens';
import { Loading } from './src/components/Loading';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Inter_400Regular,
    Inter_700Bold
  })
  return (
    <>
      {!fontsLoaded ? <HomeScreen /> : <Loading />}
      <StatusBar style="auto" />
    </>
  );
}