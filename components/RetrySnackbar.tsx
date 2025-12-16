import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RetrySnackbarProps = {
  visible: boolean;
  message: string;
  onRetry: () => void;
  onDismiss?: () => void;
};

const RetrySnackbar: React.FC<RetrySnackbarProps> = ({
  visible,
  message,
  onRetry,
  onDismiss,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={{ flexDirection: 'row',alignItems: 'center',padding: 16}}>
        <Text style={{ flex: 1,color: 'white',fontSize: 14,fontWeight: '500'}}>{message}</Text>
        <TouchableOpacity style={{backgroundColor: "#FFFFFF33",paddingHorizontal: 16,paddingVertical: 8,borderRadius: 4,marginLeft: 12}} onPress={onRetry}>
          <Text style={{ color: 'white',fontSize: 14,fontWeight: 'bold',}}>RETRY</Text>
        </TouchableOpacity>
        {onDismiss && (
          <TouchableOpacity style={{marginLeft: 8,padding: 4}} onPress={onDismiss}>
            <Text style={{  color: 'white',fontSize: 18,fontWeight: 'bold'}}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default RetrySnackbar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  }
});
