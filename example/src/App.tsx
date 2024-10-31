import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
// import { scan } from 'tangem-sdk-codora-react-native';

export default function App() {
  const [result] = useState<string | undefined>();

  useEffect(() => {
    //
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
