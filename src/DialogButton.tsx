import React from 'react';
import {
  PlatformColor,
  Pressable,
  Text,
} from 'react-native';
import { styles } from './Styles';

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

export { DialogButton };
export type { DialogButtonType }