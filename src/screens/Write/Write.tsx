import React from 'react';
import { Alert } from 'react-native';

// DB
import { useRealm } from '~/db/realm';

// Styles
import {
  StBtnSave,
  StBtnSaveText,
  StBtnEmotion,
  StTextInput,
  StTextTitle,
  StView,
  StViewEmotions,
  StTextEmotion,
} from './Write.style';

// Types
import { RootStackScreenProps } from '~/types/react-navigations';

// Emotions
export const emotions = ['😊', '😐', '🥰', '🤩', '😭', '😡'];

// Main
const Write: React.FC<RootStackScreenProps<'Write'>> = ({
  navigation: { goBack },
}) => {
  // States & Hooks
  const realm = useRealm();
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>('');
  const [feelings, setFeelings] = React.useState<string>('');

  const onChangeFeelings = React.useCallback((text: string) => {
    setFeelings(text);
  }, []);

  const onEmotionPress = React.useCallback((emotion: string) => {
    setSelectedEmotion(emotion);
  }, []);

  const onSubmit = React.useCallback(() => {
    if (feelings === '' || selectedEmotion === '') {
      return Alert.alert('', 'Please fill in all fields');
    }
    realm.write(() => {
      const feeling = realm.create('Feeling', {
        _id: Date.now(),
        emotion: selectedEmotion,
        message: feelings,
      });
      goBack();
    });
  }, [realm, selectedEmotion, feelings, goBack]);

  return (
    <StView>
      <StTextTitle>How do you feel today?</StTextTitle>
      <StViewEmotions>
        {emotions.map((emotion, index) => (
          <StBtnEmotion
            key={index}
            selected={emotion === selectedEmotion}
            onPress={() => onEmotionPress(emotion)}
          >
            <StTextEmotion>{emotion}</StTextEmotion>
          </StBtnEmotion>
        ))}
      </StViewEmotions>
      <StTextInput
        value={feelings}
        placeholder="Write your feelings..."
        // multiline
        returnKeyType="done"
        onChangeText={onChangeFeelings}
        onSubmitEditing={onSubmit}
      />
      <StBtnSave onPress={onSubmit}>
        <StBtnSaveText>Save</StBtnSaveText>
      </StBtnSave>
    </StView>
  );
};

export default Write;
