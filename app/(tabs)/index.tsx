import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { MoveablePoint } from '@/components/MoveablePoint';
import { Point } from '@/components/Point';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { AngledCombination } from '@/components/AngledCombination';

export default function HomeScreen() {

  const [angleA, setAngleA] = useState(0)
  const [angleB, setAngleB] = useState(0)

  useEffect(() => {
    setAngleB((360 - (angleA * 2)) / 2)
  }, [angleA])

  return (
 
        <View style={styles.container}>
          <View style={styles.content} id={"content"}>
            <SafeAreaProvider>
              <SafeAreaView>
              <AngledCombination diameter={25} setAngle={setAngleA} />
              </SafeAreaView>
            </SafeAreaProvider>
          </View>
          <View style={[styles.bottom]}>
            <Text style={styles.baseText}>
              <Text style={[styles.titleText]}>
                Angle A: {Math.round(angleA)}°
                {'\n'}
                Angle B: {Math.round(angleB)}°
              </Text>
            </Text>
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  flexDirection: 'column'
  },
  baseText: {
    fontFamily: 'Cochin',
    zIndex: 1
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#D3D3D3',
    flex: 10
  },
  bottom: {
    backgroundColor: '#00e6ac',
    flex: 1
  }
});
