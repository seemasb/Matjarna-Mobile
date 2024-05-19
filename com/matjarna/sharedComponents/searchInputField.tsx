import React, {useEffect} from 'react';
import {TextInput, StyleSheet, TextInputProps} from 'react-native';
import InputField from './inputField';
import SreachIcon from '../assets/icons/searchIcon';

type SearchInputFieldProps = TextInputProps & {
  placeholder: string;
  textInputRef?: React.RefObject<TextInput>;
};

const SearchInputField: React.FC<SearchInputFieldProps> = ({
  placeholder,
  textInputRef,
  secureTextEntry,
  ...textInputProps
}) => {
  return (
    <InputField
      placeholder={placeholder}
      textInputRef={textInputRef}
      prefixIcon={<SreachIcon />}
      style={{borderColor: '#000000'}}
      {...textInputProps}
    />
  );
};
export default SearchInputField;
