import React, { useEffect, useRef } from "react";
import { PanResponder, Animated } from "react-native";
import { Coordinates } from "./Goniometer";

type Props = {
  setPosition: (value: Coordinates) => void,
  dot: any
  window: {
    width: number,
    height: number
  },
  radius: number,
  zIndex: number
}

export const MoveablePoint = (props: Props) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    pan.addListener((value) => {
      props.setPosition({ x: value.x + props.radius, y: value.y + props.radius })
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
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        zIndex: props.zIndex
      }}
      {...panResponder.panHandlers}>
      {props.dot}
    </Animated.View>
  );
};
