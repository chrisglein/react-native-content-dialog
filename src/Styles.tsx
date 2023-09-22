import {
  PlatformColor,
  StyleSheet,
} from 'react-native';

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

export { styles };