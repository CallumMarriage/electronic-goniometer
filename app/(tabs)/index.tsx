import { Image, StyleSheet, Platform, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { MoveablePoint } from '@/components/MoveablePoint';
import { Point } from '@/components/Point';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Combination } from '@/components/Combination';
import { GroupedCombination } from '@/components/GroupedCombination';
import { AngledCombination } from '@/components/AngledCombination';

export default function HomeScreen() {
  
  return (
    <SafeAreaProvider>
         <SafeAreaView>
           {/* <Combination/> */}
           <AngledCombination/>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}