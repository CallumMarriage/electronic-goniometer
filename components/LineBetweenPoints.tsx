import { StyleSheet } from "react-native"
import Svg, { Line } from "react-native-svg"
import { Coordinates } from "./AngledCombination"

type Props = {
    radius: number,
    source: Coordinates,
    target: Coordinates,
    height: number,
    width: number,
    color: string
}

export const LineBetweenPoints = (props: Props) => {
    const edgeSource = getEdges(props.radius, props.source, props.target)
    const edgeTarget = getEdges(props.radius, props.target, props.source)

    return (
        <Svg height={props.height}
            width={props.width}
            style={[StyleSheet.absoluteFill, styles.line, { zIndex: 2, overflow: 'visible' }]}>
            <Line x1={edgeSource.x} y1={edgeSource.y} x2={edgeTarget.x} y2={edgeTarget.y} stroke={props.color} strokeWidth="4" />
        </Svg>
    )
}


const getEdges = (radius: number, pointA: { x: number, y: number }, pointB: { x: number, y: number }) => {
    const dx = pointA.x - pointB.x
    const dy = pointA.y - pointB.y
    const angle = Math.atan2(dy, dx)
    const edgeX = pointA.x - radius / 2 * Math.cos(angle)
    const edgeY = pointA.y - radius / 2 * Math.sin(angle)

    return { x: edgeX, y: edgeY }
}

const styles = StyleSheet.create({
    line: {
        zIndex: 1
    }
})