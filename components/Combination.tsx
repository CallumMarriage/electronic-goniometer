import { Dimensions, StyleSheet, View, PanResponder, Animated, Text } from "react-native"
import React, { useEffect, useRef, useState } from "react";

import Svg, { Circle, Line } from 'react-native-svg';
import { MoveablePoint } from "./MoveablePoint";

const { width, height } = Dimensions.get('window')

export const Combination = () => {

    const [centerPointX, setCenterPointX] = useState(0)
    const [centerPointY, setCenterPointY] = useState(200)
  
    const [rotatedPointX, setRotatedPointX] = useState(50)
    const [rotatedPointY, setRotatedPointY] = useState(100)

    const [fixedPointX, setFixedPointX] = useState(0)
    const [fixedPointY, setFixedPointY] = useState(0)

    const setCenterX = (newX: number) => {
        setCenterPointX(newX)
        setFixedPointX(newX -25)
    }

    const setCenterY = (newY: number) => {
        setCenterPointY(newY)
        setFixedPointY(newY - 250)
    }

    const rotationToCenterEdges = getEdges({x: rotatedPointX, y: rotatedPointY}, {x: centerPointX, y: centerPointY})

    const edgeX = rotationToCenterEdges.edgeX
    const edgeY = rotationToCenterEdges.edgeY

    const centerToRotatedEdges = getEdges({x: centerPointX, y: centerPointY}, {x: rotatedPointX, y: rotatedPointY})

    const edgeCenterX = centerToRotatedEdges.edgeX
    const edgeCenterY = centerToRotatedEdges.edgeY
    
    const fixedToCenterdEdges = getEdges({x: fixedPointX, y: fixedPointY}, {x: centerPointX, y: centerPointY})

    const fixedEdgeX = fixedToCenterdEdges.edgeX
    const fixedEdgeY = fixedToCenterdEdges.edgeY

    const centerToFixedEdges = getEdges({x: centerPointX, y: centerPointY}, {x: fixedPointX, y: fixedPointY})

    const fixedCenterEdgeX = centerToFixedEdges.edgeX
    const fixedCenterEdgeY = centerToFixedEdges.edgeY

    return (
        <View style={styles.container}>
            <Svg height={height} width={width} style={[StyleSheet.absoluteFill, {zIndex: 1}]}>
                <Line x1={edgeCenterX} y1={edgeCenterY} x2={edgeX} y2={edgeY} stroke="red" strokeWidth="6"/>
            </Svg>

            <Svg height={height} width={width} style={[StyleSheet.absoluteFill, {zIndex: 1} ]}>
                <Line x1={fixedCenterEdgeX} y1={fixedCenterEdgeY} x2={fixedEdgeX} y2={fixedEdgeY} stroke="red" strokeWidth="6" />
            </Svg>
    
            <View style={[styles.circle, { transform: [{translateX: fixedPointX}, {translateY: fixedPointY}], zIndex: 100}]} />

            <MoveablePoint
                setX={setCenterX}
                x={centerPointX}
                setY={setCenterY}
                y={centerPointY}
                zIndex={100}

                dot= {
                    <View style={[styles.circle]} />
                }/>

            <MoveablePoint 
                setX={setRotatedPointX} 
                setY={setRotatedPointY}
                dot={  
                    <View style={styles.circle}/>
                }
                x={rotatedPointX}
                y={rotatedPointY}
                zIndex={100}
            />


        </View>
    )


}

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
      },

    circle: {
      height: 50,
      width: 50,
      backgroundColor: 'blue',
      borderRadius: 50,
    },
  }
);

const getEdges = (pointA: {x: number, y: number}, pointB: {x: number, y: number}) => {
    const dx = pointA.x - pointB.x
    const dy = pointA.y - pointB.y
    const angle = Math.atan2(dy, dx)
    const edgeX = pointA.x - 25 * Math.cos(angle)
    const edgeY = pointA.y - 25 * Math.sin(angle)

    return { edgeX, edgeY }
}