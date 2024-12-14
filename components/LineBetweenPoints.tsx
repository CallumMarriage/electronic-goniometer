import { useRef } from "react"
import { Animated, StyleSheet } from "react-native"
import Svg, { Line } from "react-native-svg"

export const LineBetweenPoints = (props) => {

    const edgeSource = getEdges(props.source, props.target)

    const edgeTarget = getEdges(props.target, props.source)

    return ( 
            <Svg height={props.height} width={props.width} style={[StyleSheet.absoluteFill, styles.line, { zIndex: 1, overflow: 'visible' }]}>
                <Line x1={edgeSource.x} y1={edgeSource.y} x2={edgeTarget.x} y2={edgeTarget.y} stroke="red" strokeWidth="6" />
            </Svg>
    )
}


const getEdges = (pointA: { x: number, y: number }, pointB: { x: number, y: number }) => {
    const dx = pointA.x - pointB.x
    const dy = pointA.y - pointB.y
    const angle = Math.atan2(dy, dx)
    const edgeX = pointA.x - 25 * Math.cos(angle)
    const edgeY = pointA.y - 25 * Math.sin(angle)

    return { x: edgeX, y: edgeY }
}

const styles = StyleSheet.create({
    line: {
        zIndex: 1
    }
})