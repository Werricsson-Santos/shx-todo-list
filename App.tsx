import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  useFonts,
  Inter_400Regular,
  Inter_700Bold
} from '@expo-google-fonts/inter'
import { HomeScreen } from './src/screens';
import { Loading } from './src/components/Loading';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Inter_400Regular,
    Inter_700Bold
  })
  return (
    <>
      {fontsLoaded ? <HomeScreen /> : <Loading />}
    </>
  );
}