import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PanResponder, View, StyleSheet, Animated, Text, Dimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Props = {
  setX: (x: number) => void,
  setY: (x: number) => void,
  dot: any
  window: {
    width: number,
    height: number
  },
  x: number,
  y: number,
  radius: number,
  zIndex: number
}

export const MoveablePoint = (props: Props) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    pan.addListener((value) => {
      console.log(value)
      if(value.x >= 0) {
        props.setX(value.x + props.radius)
      }
      props.setY(value.y + props.radius)
    });
  }, [pan])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        return Animated.event(
          [
            null,
            {
              dx: pan.x,
              dy: pan.y,
            }
          ],
          { useNativeDriver: false } // Optional async listener
        )(evt, gestureState)
      },
      onPanResponderRelease: (e, gestureState) => {
        pan.extractOffset();
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: Animated.diffClamp(pan.x, 0, props.window.width) }, { translateY: pan.y }],
        zIndex: props.zIndex
      }}
      {...panResponder.panHandlers}>
      {props.dot}
    </Animated.View>
  );
};
