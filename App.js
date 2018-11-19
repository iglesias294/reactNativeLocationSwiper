import React from 'react';
import {
  StyleSheet, Text,
  View, Image, Dimensions,
  Animated, PanResponder, SafeAreaView, Switch, Picker
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const Users = [
  { id: "1", uri: require('./assets/yuyuan.jpg') },
  { id: "2", uri: require('./assets/hcmc.jpg') },
  { id: "3", uri: require('./assets/buiVien.jpg') },
  { id: "4", uri: require('./assets/osaka.jpg') },

]
export default class App extends React.Component {
  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })
  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }
  renderUsers = () => {
    return Users.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null
      } else if (i == this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, {
              height: SCREEN_HEIGHT - 250,
              width: SCREEN_WIDTH, padding: 10, position: 'absolute'
            }]}>
            <Animated.View style={{
              opacity: this.likeOpacity,
              transform: [{ rotate: '-30deg' }],
              position: 'absolute', top: 50, left: 40,
              zIndex: 1000
            }}>
              <Text style={{
                borderWidth: 1, borderColor: 'green', color: 'green',
                fontSize: 40, fontWeight: '900'
              }}>GO!</Text>
            </Animated.View>

            <Animated.View style={{
              opacity: this.dislikeOpacity,
              transform: [{ rotate: '30deg' }],
              position: 'absolute', top: 50, right: 40,
              zIndex: 1000
            }}>
              <Text style={{
                borderWidth: 1, borderColor: 'red', color: 'red',
                fontSize: 40, fontWeight: '900'
              }}>NO GO!</Text>
            </Animated.View>
            <Image style={{
              flex: 1, height: null, width: null,
              resizeMode: 'cover', borderRadius: 20
            }} source={item.uri} />
          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View

            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],

            }, {
              height: SCREEN_HEIGHT - 250,
              width: SCREEN_WIDTH, padding: 10, position: 'absolute'
            }]}>
            <Image style={{
              flex: 1, height: null, width: null,
              resizeMode: 'cover', borderRadius: 20
            }} source={item.uri} />
          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: '600', fontSize: 25, fontFamily: 'Avenir' }}> Wanderlustr </Text>
          <Text style={{ fontWeight: '400', fontSize: 18, fontFamily: 'Avenir' }}> Find your dream destination </Text>
        </View>

        <View style={{ flex: 1 }}>
          {this.renderUsers()}
        </View>

        <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold', color: 'red' }}>18 </Text>
            <Text> Friends have been here.</Text>
            <Text style={{ textDecorationLine: 'underline' }}> View their posts</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Switch style={{ marginRight: 10 }} value={false} /><Text style={{ fontSize: 12, fontWeight: '100' }}> Show Visa-Exempt Destinations Only</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'flex-start', justifyContent: 'flex-start' }}>
            <Picker
              itemStyle={{ height: 35, fontSize: 14 }}
              style={{
                flex: 1,
                marginRight: 10,
                marginTop: 10,
                marginLeft: 40,
                height: 35, width: 50, borderWidth: 0.5, borderColor: '#252525', borderStyle: 'dotted',
                borderRadius: 20
              }}
            >
              <Picker.Item label="USA" value="USA" />
              <Picker.Item label="Germany" value="Germany" />
              <Picker.Item label="Singapore" value="Singapore" />
            </Picker>
            <Text style={{ flex: 3, fontSize: 12, fontWeight: '100', marginTop: 10 }}> Your passport</Text>
          </View>


        </View>
      </SafeAreaView >
    );
  }
}

const styles = StyleSheet.create({
  Text: {
    fontFamily: 'BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
});
