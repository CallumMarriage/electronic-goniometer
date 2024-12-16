import { StyleSheet } from "react-native"
import Svg, { Path, Text } from "react-native-svg"
import { Coordinates, Line } from "./AngledCombination"
import { useEffect, useState } from "react"

type Props = {
    lineOne: Line,
    lineTwo: Line, 
    setAngle: (angle: number) => void,
    window: {
        height: number,
        width: number
    }
}

export const Angle = (props: Props) => {
    
    useEffect(() => {
        props.setAngle(calculateAngle(props.lineOne.end, props.lineOne.start, props.lineTwo.end))
    }, [props.lineOne, props.lineTwo])

    const vector1 = {
        x: props.lineOne.end.x - props.lineOne.start.x,
        y: props.lineOne.end.y - props.lineOne.start.y
    }

    const vector2 = {
        x: props.lineTwo.end.x - props.lineTwo.start.x,
        y: props.lineTwo.end.y - props.lineTwo.start.y
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

    const calculateArcPath = (center: Coordinates, radius: number, startAngle: number, endAngle: number) => {
        const start = {
            x: center.x + radius * Math.cos(startAngle),
            y: center.y + radius * Math.sin(startAngle)
        }
        const end = {
            x: center.x + radius * Math.cos(endAngle),
            y: center.y + radius * Math.sin(endAngle)
        }

        const largeArcFlag = endAngle - startAngle < 0 && endAngle - startAngle > (0 - Math.PI) ? '0' : '1'

        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
    }

    const arcPath = calculateArcPath(props.lineOne.start, 50, startAngle, endAngle)

    return (
        <Svg height={props.window.height} width={props.window.width} style={[StyleSheet.absoluteFill, { zIndex: 1, overflow: 'visible' }]}>
            <Path d={arcPath} stroke="red" strokeWidth={2} fill={"none"} />
          </Svg>
    )
}


const calculateAngle = (a: Coordinates, b: Coordinates, c: Coordinates) => {

    var AB = Math.sqrt(Math.pow(b.x-a.x,2)+ Math.pow(b.y-a.y,2));    
    var BC = Math.sqrt(Math.pow(b.x-c.x,2)+ Math.pow(b.y-c.y,2)); 
    var AC = Math.sqrt(Math.pow(c.x-a.x,2)+ Math.pow(c.y-a.y,2));

    if(b.x > a.x) {
        return 360 - ((Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)) * 180)/ Math.PI)
    }
    return (Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)) * 180)/ Math.PI;
}