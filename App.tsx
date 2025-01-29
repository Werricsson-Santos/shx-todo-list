import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { 
  useFonts,
  Inter_400Regular,
  Inter_700Bold
} from '@expo-google-fonts/inter'
import { theme } from './src/theme';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Inter_400Regular,
    Inter_700Bold
  })
  return (
    <View style={styles.container}>
      {fontsLoaded ? ( 
        <Text>Carregou</Text> 
      ) : (
        <ActivityIndicator size={50} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.base.gray600,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
