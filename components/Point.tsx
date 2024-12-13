import { StyleSheet, View } from "react-native";

export const Point = (props) => {
    return (
        <View 
        style={styles.circle} 
        onLayout={event => {
            const layout = event.nativeEvent.layout;
            console.log(layout)
            props.setX(layout.x)
            props.setY(layout.y);
          }}
        />
    )
}

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },

    circle: {
      backgroundColor: 'blue',
      borderRadius: 50,
    },
  });