import React, { PropsWithChildren } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Popup} from 'react-native-windows';
import type { DialogButtonType } from './DialogButton';
import { DialogButton } from './DialogButton';
import { styles } from './Styles';

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
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;
  const scaleAnimation = React.useRef(new Animated.Value(1.0)).current;
  const inTransition = !show && !hidden;

  React.useEffect(() => {
    const ControlNormalAnimationDuration = 250;
    const ControlFastAnimationDuration = 167;
    const ControlFasterAnimationDuration = 83;
    // XAML has value of '0,0,0,1', not sure which control points that maps to, so using ease;
    const ControlFastOutSlowInKeySpline = Easing.ease;
    if (show) {
      // DialogShowing https://github.com/microsoft/microsoft-ui-xaml/blob/df0800178657c470eb9f25ef185ce906e8da3279/dev/CommonStyles/ContentDialog_themeresources.xaml#L110
      setHidden(false);
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: ControlFastAnimationDuration,
        useNativeDriver: true,
      }).start();
      Animated.timing(scaleAnimation, {
        toValue: 1.0,
        duration: ControlNormalAnimationDuration,
        easing: ControlFastOutSlowInKeySpline,
        useNativeDriver: true,
      }).start();
    } else {
      // DialogHidden https://github.com/microsoft/microsoft-ui-xaml/blob/df0800178657c470eb9f25ef185ce906e8da3279/dev/CommonStyles/ContentDialog_themeresources.xaml#L88C38-L88C38
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: ControlFasterAnimationDuration,
        useNativeDriver: true,
      }).start(() => {
        setHidden(true);
      });
      Animated.timing(scaleAnimation, {
        toValue: 1.05,
        duration: ControlFastAnimationDuration,
        easing: ControlFastOutSlowInKeySpline,
        useNativeDriver: true,
      }).start();
    }
  }, [show, opacityAnimation]);

  const populatedButtons = buttons ?? [
    {
      title: 'OK',
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

  // NOT YET IMPLEMENTED: Dialog has an elevation effect done in the XAML source code here:
  // https://microsoft.visualstudio.com/OS/_git/os.2020?path=/onecoreuap/windows/dxaml/xcp/dxaml/lib/ContentDialog_Partial.cpp&version=GBofficial/main&line=1412&lineEnd=1413&lineStartColumn=1&lineEndColumn=1&lineStyle=plain&_a=contents
  //   Under drop shadows, ContentDialog has a larger shadow than normal
  //   IFC_RETURN(ApplyElevationEffect(m_tpBackgroundElementPart.AsOrNull<IUIElement>().Get(), 0 /* depth */, 128 /* baseElevation */));
  // That's going to do 2 things:
  // 1) Set a Z transformation
  // 2) Create a ThemeShadow: https://learn.microsoft.com/en-us/uwp/api/windows.ui.xaml.media.themeshadow?view=winrt-22621
  
  return (
    <Popup
      accessibilityLabel={title}
      isOpen={!hidden}
      isLightDismissEnabled={isLightDismissEnabled ?? false}
      onDismiss={() => close()}>
      <View style={
        {
          // This isn't correct because if the window is resized we don't re-run this, but it's close enough for now.
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.View style={[
          styles.smokeLayer, {
            opacity: opacityAnimation,
          }]}>
        </Animated.View>
        <Animated.View
          style={[
            styles.dialogBackground, {
              opacity: opacityAnimation,
              // scale isn't getting the right centerpoint, which _should_ work: https://github.com/microsoft/react-native-windows/pull/4169/files
              transform: [{scale: scaleAnimation}],
            }]}>
          {inTransition && 
            <Pressable
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 1,
              }}
              onPress={() => {
                // Intentionally eating clicks while animating
              }}
            />
          }
          <View style={[styles.dialogTopArea, {flexShrink: 1}]}>
            <ScrollView style={[styles.dialogContentArea, {flexShrink: 1, flexGrow: 0}]}>
              <Text style={styles.dialogTitle}>
                {title}
              </Text>
              {children}
            </ScrollView>
          </View>
          <View style={styles.dialogCommandArea}>
            <View style={styles.dialogButtons}>
              {buttonList}
            </View>
          </View>
        </Animated.View>
      </View>
    </Popup>
  );
}

export { ContentDialog };