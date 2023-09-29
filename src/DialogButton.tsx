import React from 'react';
import {
  Pressable,
  Text,
} from 'react-native';
import { styles, getButtonBackground, getButtonForeground } from './Styles';

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
        backgroundColor: getButtonBackground(isDefault ?? false, pressing, hovering)
      }]}>
      <Text
        accessible={false}
        style={{
          color: getButtonForeground(isDefault ?? false, pressing, hovering)
        }}>{title}</Text>    
    </Pressable>
  );
}

export { DialogButton };
export type { DialogButtonType };