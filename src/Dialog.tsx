import React, { PropsWithChildren } from 'react';
import {
  Animated,
  Dimensions,
  PlatformColor,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
//import {Popup} from 'react-native-windows';

const Popup = (props: any) => {
    return (
        <Text>Popup</Text>
    )
}

type DialogButtonType = {
  title: string,
  onPress: () => void,
}

type DialogButtonProps = {
  title: string,
  onPress: () => void,
  isDefault?: boolean,
}
function DialogButton({title, onPress, isDefault}: DialogButtonProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const [pressing, setPressing] = React.useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressing(true)}
      onPressOut={() => setPressing(false)}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}
      style={{
        padding: 8,
        minWidth: 100,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 4,
        backgroundColor: 
          isDefault ? 
            pressing ? 
              'purple' :
              hovering ? 
                'teal' : 
                'blue' :
            pressing ? 
              PlatformColor('ButtonBackgroundPressed') :
              hovering ? 
                PlatformColor('ButtonBackgroundPointerOver') :
                PlatformColor('ButtonBackground')
      }}>
      <Text style={{
        color: 
          isDefault ? 
            pressing ? 
              'white' :
              hovering ? 
                'white' :
                'white' :
            pressing ?
              PlatformColor('ButtonForegroundPressed') :
              hovering ?
                PlatformColor('ButtonForegroundPointerOver') :
                PlatformColor('ButtonForeground')
      }}>{title}</Text>    
    </Pressable>
  )
}

type ContentDialogProps = PropsWithChildren<{
  show: boolean,
  close: () => void;
  isLightDismissEnabled?: boolean,
  title: string,
  buttons?: DialogButtonType[],
  defaultButtonIndex?: number,
}>;
function ContentDialog({children, show, close, isLightDismissEnabled, title, buttons, defaultButtonIndex}: ContentDialogProps): JSX.Element {
  const [hidden, setHidden] = React.useState(!show);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const inTransition = !show && !hidden;

  React.useEffect(() => {
    if (show) {
      setHidden(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setHidden(true);
      });
    }
  }, [show, fadeAnim]);

  const populatedButtons = buttons ?? [
      {
        title: "OK",
        onPress: () => {}
      }];
  const buttonList = populatedButtons.map((button, index) =>
    <DialogButton
      key={index}
      isDefault={defaultButtonIndex !== undefined ? index === defaultButtonIndex : false}
      title={button.title}
      onPress={() => {
        button.onPress();
        close();
      }}/>
  );
  
  return (
    <Popup
      isOpen={!hidden}
      isLightDismissEnabled={isLightDismissEnabled ?? false}
      onDismiss={() => close()}>
        
      <View style={{
          backgroundColor: PlatformColor('ContentDialogSmokeFill'),
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          justifyContent: 'center',
          alignItems: 'center',
          }}>
          <Animated.View style={{
              opacity: fadeAnim,
            }}>
            <View style={{
              minWidth: 320, // ContentDialogMinWidth
              maxWidth: 548, // ContentDialogMaxWidth
              minHeight: 184, // ContentDialogMinHeight
              maxHeight: 756, // ContentDialogMaxHeight
              borderRadius: 8, // OverlayCornerRadius
              borderWidth: 1, // ContentDialogBorderWidth
              borderColor: PlatformColor('ContentDialogBorderBrush'),
              }}>
              {inTransition && <Pressable
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                }}
                onPress={() => {
                  console.log("I EAT CLICKS NOM NOM");
                }}
                />
              }
              <View style={[styles.dialogBackground, {flexShrink: 1}]}>
                <Text
                  accessibilityRole="header"
                  style={styles.dialogTitle}>
                  {title}
                </Text>
                <ScrollView style={[styles.dialogContentArea, {flexShrink: 1, flexGrow: 0}]}>
                  {children}
                </ScrollView>
              </View>
              <View style={styles.dialogButtonBackground}>
                <View style={styles.dialogButtons}>
                  {buttonList}
                </View>
              </View>
            </View>
        </Animated.View>
      </View>
    </Popup>
  )
}

const isDarkMode = false;
const styles = StyleSheet.create({
  dialogTitle: {
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 12,
    },
  dialogBackground: {
    //backgroundColor: PlatformColor('ContentDialogBackground'),
    backgroundColor: isDarkMode ? '#292929' : '#FFFFFF',
    paddingLeft: 24, // ContentDialogPadding
    paddingRight: 24, // ContentDialogPadding
    paddingTop: 24, // ContentDialogPadding
    borderTopLeftRadius: 8, // OverlayCornerRadius
    borderTopRightRadius: 8, // OverlayCornerRadius
    },
  dialogContentArea: {
    paddingBottom: 24, // ContentDialogPadding
    },
  dialogButtonBackground: {
    borderColor: isDarkMode ? '#1D1D1D': '#E5E5E5',
    borderTopWidth: 1,
    backgroundColor: isDarkMode ? '#202020' : '#F3F3F3',
    borderBottomLeftRadius: 8, // OverlayCornerRadius
    borderBottomRightRadius: 8, // OverlayCornerRadius
    padding: 12,
    },
  dialogButtons: {
    marginTop: 12,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    },
});

export { ContentDialog }