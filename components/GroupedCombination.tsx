import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, PanResponder, StyleSheet, View } from "react-native"
import { MoveablePoint } from "./MoveablePoint"
import Svg, { Line } from "react-native-svg"
import { LineBetweenPoints } from "./LineBetweenPoints"

const window = Dimensions.get('window')

export const GroupedCombination = (props) => {

    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })

    const [centerPointX, setCenterPointX] = useState(0)
    const [centerPointY, setCenterPointY] = useState(200)

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
            setPanPosition(value)
        });
    })

    return (
        <View style={styles.container} id="container">
            <Animated.View
                id="animated-view"
                style={{
                    transform: [{ translateX: Animated.diffClamp(groupPan.x, 0, window.width - 50) }, { translateY: Animated.diffClamp(groupPan.y, 0, window.height - 25) }],
                    width: dimensions.window.width,
                    height: dimensions.window.height,
                    overflow: 'visible'
                }}
                {...groupPanResponder.panHandlers}>
                <View>
                    <View style={[styles.circle, { transform: [{ translateX: fixedPointX }, { translateY: fixedPointY }], zIndex: 100 }]} />
                    <View style={[styles.circle, { transform: [{ translateX: centerPointX }, { translateY: centerPointY }], zIndex: 100 }]} />

                    <MoveablePoint
                        setX={setRotatedPointX}
                        setY={setRotatedPointY}
                        dot={
                            <View style={styles.circle} />
                        }
                        window={dimensions.window}
                        x={rotatedPointX}
                        y={rotatedPointY}

                        zIndex={100}
                    />
                    <LineBetweenPoints
                        source={{ x: centerPointX + 25, y: centerPointY + 75}}
                        target={{ x: rotatedPointX + 25, y: rotatedPointY + 125 }}
                        width={dimensions.window.width}
                        height={dimensions.window.height}
                    />

                    <LineBetweenPoints
                        source={{ x: centerPointX + 25, y: centerPointY + 100 }}
                        target={{ x: fixedPointX + 25, y: fixedPointY }}
                        width={dimensions.window.width}
                        height={dimensions.window.height}
                    />
                </View>
            </Animated.View>

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
    },
    animatedView: {
        overflow: 'visible'
    }
}
);