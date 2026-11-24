import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '@config/colors.config';
import { TextStyle, StyleProp } from 'react-native';

interface AppTextProps {
  text?: string;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'primary' | 'secondary' | 'white' | 'green' | 'error';
  size?: number;
  bold?: boolean;
}

const AppText: React.FC<AppTextProps> = ({ 
  text, 
  children, 
  style, 
  variant = 'primary', 
  size, 
  bold 
}) => {
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return COLORS.text.primary;
      case 'secondary':
        return COLORS.text.secondary;
      case 'white':
        return COLORS.text.white;
      case 'green':
        return COLORS.text.green;
      case 'error':
        return COLORS.text.error;
      default:
        return COLORS.text.primary;
    }
  };

  const fontSize = size || 14;
  const fontWeight = bold ? '700' : '400';

  const combinedStyle = StyleSheet.flatten([
    {
      color: getTextColor(),
      fontSize,
      fontWeight,
    },
    style,
  ]);

  return (
    <Text style={combinedStyle}>
      {text || children}
    </Text>
  );
};


export default AppText;