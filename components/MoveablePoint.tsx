import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PanResponder, View, StyleSheet, Animated, Text, Dimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get('window')

export const MoveablePoint = (props) => {
    const pan = useRef(new Animated.ValueXY({x: props.x, y: props.y})).current;

    useEffect(() => {
      pan.addListener((value) => {
        props.setX(value.x + 25)
        props.setY(value.y + 75)
      });
  
      return () => {
        pan.removeAllListeners();
      };
    })

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderMove: Animated.event(
          [
            null,
            {
              dx: pan.x, 
              dy: pan.y,
            },
          ],
          {useNativeDriver: false}, // Optional async listener
        ),
        onPanResponderRelease: (e, gestureState) => {
          pan.extractOffset();
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
      })
    ).current;

    return (
          <Animated.View
            style={{
              transform: [{translateX: Animated.diffClamp(pan.x, 0, width - 25)}, {translateY: Animated.diffClamp(pan.y, 0, height - 25)}
              ],
              zIndex: props.zIndex
            }}
            {...panResponder.panHandlers}>
            {props.dot}
          </Animated.View>
    );
  };
