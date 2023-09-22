# React Native Content Dialog [![npm version](https://badge.fury.io/js/react-native-content-dialog.svg)](https://badge.fury.io/js/react-native-content-dialog)
Fluent dialog for display custom content with title and buttons

### Install

#### Yarn
```npm
yarn add react-native-content-dialog
```

### Get Started

```jsx
import React from 'react';
import { Button, Text,View } from 'react-native';

import { ContentDialog } from 'react-native-content-dialog';

export default function App(): JSX.Element {
  const [showDialog, setShowDialog] = React.useState(false);
  return (
    <View>
      <Button title='Show dialog' onPress={() => {setShowDialog(true)}}/>
      <ContentDialog
        title='This is my dialog title'
        show={showDialog}>
        close={() => setShowDialog(false)}>
        <Text>This is my dialog content</Text>
      </ContentDialog>
    <View/>
  );
};
```


