import { StyleSheet, View } from "react-native"

type Props = {
    diameter: number,
    color: string,
    zIndex: number,
    transformY: number
}

export const Circle = (props: Props) => {
    return (
        <View style={[
            styles({ diameter: props.diameter, color: props.color, zIndex: props.zIndex }).circle,
            { transform: [{ translateY: props.transformY }] }
        ]} />
    )
}

type StyleProps = {
    diameter: number,
    color: string,
    zIndex: number
}

const styles = (props: StyleProps) => StyleSheet.create({
    circle: {
        height: props.diameter,
        width: props.diameter,
        backgroundColor: props.color,
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 2,
        zIndex: props.zIndex
    }
});