/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import { ContentDialog } from '../src/Dialog';

function App(): JSX.Element {
  const [showDialog, setShowDialog] = React.useState(false);
  return (
    <View>
      <Button title='Show dialog' onPress={() => {setShowDialog(true)}}/>
      <ContentDialog
        title='This is my dialog title'
        show={showDialog}
        close={() => setShowDialog(false)}>
        <Text>This is my dialog content</Text>
      </ContentDialog>
    </View>
  );
}

export default App;
