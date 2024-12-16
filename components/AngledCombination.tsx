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

    const [dimensions, setDimensions] = useState({
        window: window
    });

    const [panPosition, setPanPosition] = useState<Coordinates>({ x: 0, y: 0 })

    const [rotatedPointX, setRotatedPointX] = useState(0)
    const [rotatedPointY, setRotatedPointY] = useState(0)

    const [lineFromCenterToRotated, setLineFromCenterToRotated] = useState<Line>({
        start: { x: panPosition.x, y: panPosition.y },
        // Both positions adjust for the position being in the top left corner so we have to remove one of the adjustments to get the center
        end: { x: panPosition.x + rotatedPointX - radius, y: panPosition.y + rotatedPointY - radius }
    })

    const fixedPointTransformation = -200

    const groupPan = useRef(new Animated.ValueXY({x:0, y: 0 - diameter})).current

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
            setPanPosition({
                x: value.x + radius,
                y: value.y + radius + diameter
            })
        });
    }, [groupPan])

    useEffect(() => {
        setLineFromCenterToRotated(
            {
                start: { x: panPosition.x, y: panPosition.y },
                // Both positions adjust for the position being in the top left corner so we have to remove one of the adjustments to get the center
                end: { x: panPosition.x + rotatedPointX - radius, y: panPosition.y - diameter + rotatedPointY - radius }
            })
    }, [radius, panPosition, rotatedPointX, rotatedPointY])

    const lineFromCenterToFixed = {
        start: { x: panPosition.x, y: panPosition.y },
        end: { x: panPosition.x, y: panPosition.y + fixedPointTransformation }
    }

    const lineFromCenterToBottom = {
        start: { x: panPosition.x, y: panPosition.y },
        end: { x: panPosition.x, y: panPosition.y - fixedPointTransformation }
    }

    const lineFromCenterToOppositeRotated = {
        start: { x: panPosition.x, y: panPosition.y },
        // Both positions adjust for the position being in the top left corner so we have to remove one of the adjustments to get the center
        end: { x: panPosition.x - rotatedPointX + radius, y: panPosition.y + diameter - rotatedPointY + radius }
    }

    return (
        <View id="container">
            <Animated.View
                id="animated-view"
                style={{
                    transform: [{ translateX: groupPan.x }, { translateY: groupPan.y }],
                    overflow: 'visible',
                    zIndex: 97
                 }}
                {...groupPanResponder.panHandlers}>
                <MoveablePoint
                    setX={setRotatedPointX}
                    setY={setRotatedPointY}
                    dot={
                        <View style={[styles({ radius: diameter }).circle]} />
                    }
                    window={dimensions.window}
                    x={rotatedPointX}
                    y={rotatedPointY}
                    radius={radius}
                    zIndex={100}
                />
                <View style={[styles({ radius: diameter }).circle, { zIndex: 99}]} />
                <View style={[styles({ radius: diameter }).circle, { transform: [{ translateY: fixedPointTransformation }], zIndex: 98 }]} />
            </Animated.View>
            <LineBetweenPoints
                source={lineFromCenterToRotated.start}
                target={lineFromCenterToRotated.end}
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
                source={lineFromCenterToOppositeRotated.start}
                target={lineFromCenterToOppositeRotated.end}
                width={dimensions.window.width}
                height={dimensions.window.height}
                radius={diameter}
                color="green"
            />
            <Angle window={window} lineOne={lineFromCenterToFixed} lineTwo={lineFromCenterToRotated} setAngle={props.setAngle} color="red" />
            <Angle window={window} lineOne={lineFromCenterToRotated} lineTwo={lineFromCenterToBottom} color="green" />
            <Angle window={window} lineOne={lineFromCenterToBottom} lineTwo={lineFromCenterToOppositeRotated} color="red"/>
            <Angle window={window} lineOne={lineFromCenterToOppositeRotated} lineTwo={lineFromCenterToFixed} color="green"/>


        </View>
    )
}


const styles = (props?: any) => StyleSheet.create({
    container: {
        justifyContent: 'center'
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