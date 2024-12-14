import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, PanResponder, StyleSheet, View } from "react-native"
import { MoveablePoint } from "./MoveablePoint"
import Svg, { Line, Path } from "react-native-svg"
import { LineBetweenPoints } from "./LineBetweenPoints"

const window = Dimensions.get('window')

export const AngledCombination = (props) => {

    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })

    const [rotatedPointX, setRotatedPointX] = useState(0)
    const [rotatedPointY, setRotatedPointY] = useState(0)

    const [fixedPointX, setFixedPointX] = useState(0)
    const [fixedPointY, setFixedPointY] = useState(0)

    const groupPan = useRef(new Animated.ValueXY()).current
    const [dimensions, setDimensions] = useState({
        window: window
    });


    useEffect(() => {
        const subscription = Dimensions.addEventListener(
            'change',
            ({ window }) => {
                setDimensions({ window });
            },
        );
        return () => subscription?.remove();
    });

    const groupPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.numberActiveTouches === 1;
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    {
                        dx: groupPan.x,
                        dy: groupPan.y,
                    },
                ],
                { useNativeDriver: false }, // Optional async listener
            ),
            onPanResponderRelease: (e, gestureState) => {
                groupPan.extractOffset();
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
        })
    ).current;

    useEffect(() => {
        groupPan.addListener((value) => {
            let coordinates = { x: panPosition.x, y: panPosition.y }
            if (value.x >= 0 && value.x < dimensions.window.width) {
                coordinates.x = value.x
            }
            if (value.y >= 0 && value.y <= dimensions.window.height) {
                coordinates.y = value.y
            }
            setPanPosition(coordinates)
        });
    }, [groupPan])


    const lineFromCenterToRotated = {
        start: { x: panPosition.x + 25, y: panPosition.y + 200 + 75 },
        end: { x: panPosition.x + rotatedPointX + 25, y: panPosition.y + rotatedPointY + 125 }
    }

    const lineFromCenterToFixed = {
        start: { x: panPosition.x + 25, y: panPosition.y + 200 + 100 },
        end: { x: panPosition.x + 25, y: panPosition.y }
    }

    const vector1 = {
        x: lineFromCenterToRotated.end.x - lineFromCenterToRotated.start.x,
        y: lineFromCenterToRotated.end.y - lineFromCenterToRotated.start.y
    }

    const vector2 = {
        x: lineFromCenterToFixed.end.x - lineFromCenterToFixed.start.x,
        y: lineFromCenterToFixed.end.y - lineFromCenterToFixed.start.y
    }

    const magnitude = (vector: { x: number, y: number }) => Math.sqrt(vector.x ** 2 + vector.y ** 2)

    const unitVector1 = {
        x: vector1.x / magnitude(vector1),
        y: vector1.y / magnitude(vector1)
    }

    const unitVector2 = {
        x: vector2.x / magnitude(vector2),
        y: vector2.y / magnitude(vector2)
    }

    const angleOfVector = (vector: { x: number, y: number }) => Math.atan2(vector.y, vector.x)

    const startAngle = angleOfVector(unitVector1)
    const endAngle = angleOfVector(unitVector2)

    const calculateArcPath = (center, radius, startAngle, endAngle) => {
        const start = {
            x: center.x + radius * Math.cos(startAngle),
            y: center.y + radius * Math.sin(startAngle)
        }
        const end = {
            x: center.x + radius * Math.cos(endAngle),
            y: center.y + radius * Math.sin(endAngle)
        }

        const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1'

        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
    }

    const arcPath = calculateArcPath(lineFromCenterToRotated.start, 50, startAngle, endAngle)

    console.log('Path ' + arcPath)
    return (
        <View style={[styles.container]} id="container">
            <Animated.View
                id="animated-view"
                style={{
                    transform: [{ translateX: Animated.diffClamp(groupPan.x, 0, window.width) }, { translateY: Animated.diffClamp(groupPan.y, 0, window.height) }],
                    // width: dimensions.window.width,
                    // height: dimensions.window.height,
                    overflow: 'visible',
                    zIndex: 99
                }}
                {...groupPanResponder.panHandlers}>
                <View>
                    <View style={[styles.circle, { transform: [{ translateX: fixedPointX }, { translateY: fixedPointY }], zIndex: 100 }]} />
                    <View style={[styles.circle, { transform: [{ translateY: 200 }], zIndex: 100 }]} />

                    <MoveablePoint
                        setX={setRotatedPointX}
                        setY={setRotatedPointY}
                        dot={
                            <View style={[styles.circle]}/>
                        }
                        window={dimensions.window}
                        x={rotatedPointX}
                        y={rotatedPointY}

                        zIndex={100}
                    />
                </View>
            </Animated.View>
            <LineBetweenPoints
                source={lineFromCenterToRotated.start}
                target={lineFromCenterToRotated.end}
                width={dimensions.window.width}
                height={dimensions.window.height}
            />

            <LineBetweenPoints
                source={lineFromCenterToFixed.start}
                target={lineFromCenterToFixed.end}
                width={dimensions.window.width}
                height={dimensions.window.height}
            />
            <Svg height={window.height} width={window.width} style={[StyleSheet.absoluteFill, { zIndex: 1, overflow: 'visible' }]}>
                <Path d={arcPath} stroke="red" strokeWidth={2} fill={"none"} />
            </Svg>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        overflow: 'visible'
    },

    circle: {
        height: 50,
        width: 50,
        backgroundColor: 'blue',
        borderRadius: 50,
        justifyContent: 'center',
        alignContent: 'center'
    },
    animatedView: {
        overflow: 'visible'
    }
}
);