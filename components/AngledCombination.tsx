import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from "react-native"
import { MoveablePoint } from "./MoveablePoint"
import { LineBetweenPoints } from "./LineBetweenPoints"
import { Angle } from "./Angle"

const window = Dimensions.get('window')

export type Coordinates = {
    x: number,
    y: number
}

export type Line = {
    start: Coordinates,
    end: Coordinates
}

type Props = {
    setAngle: (angle: number) => void,
    diameter: number
}

export const AngledCombination = (props: Props) => {
    const diameter = props.diameter
    const radius = diameter / 2
    const [component, setComponent] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    })
    const [dimensions, setDimensions] = useState({ window: window });
    const [panPosition, setPanPosition] = useState<Coordinates>({ x: 0, y: 0 })
    const [moveablePoint, setMoveablePoint] = useState<Coordinates>({ x: 0, y: 0 })
    const [center, setCenter] = useState<Coordinates>({ x: 0, y: 0 })
    const fixedPointTransformation = -200
    const groupPan = useRef(new Animated.ValueXY({ x: 0, y: 0 - diameter })).current

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

    // This two useEffects cause poor performance on Android due to repeated set state calls.
    useEffect(() => {
        groupPan.addListener((value) => {
            const updated = {
                x: value.x + radius,
                y: value.y + radius + diameter
            }
            setPanPosition(updated)
        });
    }, [groupPan])

    useEffect(() => {
        setCenter({ x: component.x + panPosition.x, y: component.y + panPosition.y })
    }, [panPosition])

    const lineFromCenterToMoveable = {
        start: center,
        // Both positions adjust for the position being in the top left corner so we have to remove one of the adjustments to get the center
        end: { x: center.x + moveablePoint.x - radius, y: center.y - diameter + moveablePoint.y - radius }
    }

    const lineFromCenterToFixed = {
        start: center,
        end: { x: center.x, y: center.y + fixedPointTransformation }
    }

    const lineFromCenterToBottom = {
        start: center,
        end: { x: center.x, y: center.y - fixedPointTransformation }
    }

    const lineFromCenterToOppositeMoveable = {
        start: center,
        // Both positions adjust for the position being in the top left corner so we have to remove one of the adjustments to get the center
        end: { x: center.x - moveablePoint.x + radius, y: center.y + diameter - moveablePoint.y + radius }
    }

    // Needed to create these objects to allow roatating the moving point 360 degrees.
    const shouldFlipAngles = lineFromCenterToMoveable.end.x < lineFromCenterToMoveable.start.x

    const redAnglePositive = {
        lineOne: shouldFlipAngles ? lineFromCenterToFixed : lineFromCenterToMoveable,
        lineTwo: shouldFlipAngles ? lineFromCenterToMoveable : lineFromCenterToFixed
    }

    const greenAnglePositive = {
        lineOne: shouldFlipAngles ? lineFromCenterToMoveable : lineFromCenterToBottom,
        lineTwo: shouldFlipAngles ? lineFromCenterToBottom : lineFromCenterToMoveable
    }

    const redAngleNegative = {
        lineOne: shouldFlipAngles ? lineFromCenterToBottom : lineFromCenterToOppositeMoveable,
        lineTwo: shouldFlipAngles ? lineFromCenterToOppositeMoveable : lineFromCenterToBottom
    }

    const greenAngleNegative = {
        lineOne: shouldFlipAngles ? lineFromCenterToOppositeMoveable : lineFromCenterToFixed,
        lineTwo: shouldFlipAngles ? lineFromCenterToFixed : lineFromCenterToOppositeMoveable
    }

    // The lines should be inside the animated view, if they were the storing of the 'component' and 'center'
    // However, there is an issue withe the view box not being centered on (0,0) which means that the the SVGs are not completetly visible.
    return (
        <View style={styles({ radius: diameter }).container} id="container">
            <Animated.View
                id="animated-view"
                style={{
                    transform: [{ translateX: groupPan.x }, { translateY: groupPan.y }],
                    overflow: 'visible',
                    zIndex: 97
                }}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout
                    setComponent(layout)
                    setCenter({ x: layout.x + panPosition.x + radius, y: layout.y + panPosition.y + radius })
                }}
                {...groupPanResponder.panHandlers}>
                <MoveablePoint
                    setPosition={setMoveablePoint}
                    dot={
                        <View style={[styles({ radius: diameter }).circle]} />
                    }
                    window={dimensions.window}
                    radius={radius}
                    zIndex={100}
                />
                <View style={[styles({ radius: diameter }).circle, { zIndex: 99 }]} />
                <View style={[styles({ radius: diameter }).circle, { transform: [{ translateY: fixedPointTransformation }], zIndex: 98 }]} />
            </Animated.View>
            <LineBetweenPoints
                source={lineFromCenterToMoveable.start}
                target={lineFromCenterToMoveable.end}
                width={dimensions.window.width}
                height={dimensions.window.height}
                radius={diameter}
                color="green"
            />

            <LineBetweenPoints
                source={lineFromCenterToFixed.start}
                target={lineFromCenterToFixed.end}
                width={dimensions.window.width}
                height={dimensions.window.height}
                radius={diameter}
                color="red"
            />

            <LineBetweenPoints
                source={lineFromCenterToBottom.start}
                target={lineFromCenterToBottom.end}
                width={dimensions.window.width}
                height={dimensions.window.height}
                radius={diameter}
                color="red"
            />

            <LineBetweenPoints
                source={lineFromCenterToOppositeMoveable.start}
                target={lineFromCenterToOppositeMoveable.end}
                width={dimensions.window.width}
                height={dimensions.window.height}
                radius={diameter}
                color="green"
            />
            <Angle window={window} lineOne={redAnglePositive.lineOne} lineTwo={redAnglePositive.lineTwo} setAngle={props.setAngle} color="red" />
            <Angle window={window} lineOne={greenAnglePositive.lineOne} lineTwo={greenAnglePositive.lineTwo} color="green" />
            <Angle window={window} lineOne={redAngleNegative.lineOne} lineTwo={redAngleNegative.lineTwo} color="red" />
            <Angle window={window} lineOne={greenAngleNegative.lineOne} lineTwo={greenAngleNegative.lineTwo} color="green" />
        </View>
    )
}


// TODO Refactor so that props are only required when accessing the circle styles
const styles = (props?: any) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circle: {
        height: props.radius,
        width: props.radius,
        backgroundColor: 'blue',
        borderRadius: 50
    },
    animatedView: {
        overflow: 'visible'
    }
});