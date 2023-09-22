import React, { PropsWithChildren } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PlatformColor,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Popup} from 'react-native-windows';

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
      accessibilityLabel={title}
      accessibilityRole='button'
      onPress={onPress}
      onPressIn={() => setPressing(true)}
      onPressOut={() => setPressing(false)}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}
      style={[styles.dialogButton, {
        backgroundColor: 
          isDefault ? 
            pressing ? 
              PlatformColor('AccentButtonBackgroundPressed') :
              hovering ? 
                PlatformColor('AccentButtonBackgroundPointerOver') : 
                PlatformColor('AccentButtonBackground') :
            pressing ? 
              PlatformColor('ButtonBackgroundPressed') :
              hovering ? 
                PlatformColor('ButtonBackgroundPointerOver') :
                PlatformColor('ButtonBackground')
      }]}>
      <Text
        accessible={false}
        style={{
          color: 
            isDefault ? 
              pressing ? 
                PlatformColor('AccentButtonForegroundPressed') :
                hovering ? 
                  PlatformColor('AccentButtonForegroundPointerOver') :
                  PlatformColor('AccentButtonForeground') :
              pressing ?
                PlatformColor('ButtonForegroundPressed') :
                hovering ?
                  PlatformColor('ButtonForegroundPointerOver') :
                  PlatformColor('ButtonForeground')
        }}>{title}</Text>    
    </Pressable>
  );
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

const styles = StyleSheet.create({
  smokeLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: PlatformColor('ContentDialogSmokeFill'),
  },
  dialogTitle: {
    fontSize: 20, // Hardcoded in https://github.com/microsoft/microsoft-ui-xaml/blob/df0800178657c470eb9f25ef185ce906e8da3279/dev/CommonStyles/ContentDialog_themeresources_v1.xaml#L311C174-L311C174
    fontWeight: '600', // SemiBold, hardcoded in original file
    marginBottom: 12, // ContentDialogTitleMargin
  },
  dialogBackground: {
    minWidth: 320, // ContentDialogMinWidth
    maxWidth: 548, // ContentDialogMaxWidth
    minHeight: 184, // ContentDialogMinHeight
    maxHeight: 756, // ContentDialogMaxHeight
    borderRadius: 8, // OverlayCornerRadius
    borderWidth: 1, // ContentDialogBorderWidth
    borderColor: PlatformColor('ContentDialogBorderBrush'),
    // Technically this is adding overdraw, but it's the way the XAML brushes are set up and is required for dark mode
    backgroundColor: PlatformColor('ContentDialogBackground'),
  },
  dialogTopArea: {
    backgroundColor: PlatformColor('ContentDialogTopOverlay'),
    paddingLeft: 24, // ContentDialogPadding
    paddingRight: 24, // ContentDialogPadding
    borderTopLeftRadius: 8, // OverlayCornerRadius
    borderTopRightRadius: 8, // OverlayCornerRadius
  },
  dialogContentArea: {
    marginVertical: 24, // ContentDialogPadding
  },
  dialogCommandArea: {
    borderColor: PlatformColor('ContentDialogSeparatorBorderBrush'),
    borderTopWidth: 1,
    backgroundColor: PlatformColor('ContentDialogBackground'),
    borderBottomLeftRadius: 8, // OverlayCornerRadius
    borderBottomRightRadius: 8, // OverlayCornerRadius
    padding: 24, // ContentDialogPadding
  },
  dialogButtons: {
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 8, // ContentDialogButtonSpacing
  },
  dialogButton: {
    flexGrow: 1,
    flex: 1,
    paddingHorizontal: 8, // ButtonPadding
    paddingVertical: 5, // ButtonPadding
    alignItems: 'center',
    borderWidth: 1, // ButtonBorderThemeThickness
    borderColor: PlatformColor('AccentButtonBorderBrush'),
    borderRadius: 4, // ControlCornerRadius
    backgroundColor: PlatformColor('ButtonBackground'),
  },
});

export { ContentDialog };