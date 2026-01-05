import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
}

const MAX_LINES = 3;

const Card: React.FC<CardProps> = ({ title, subtitle, description }) => {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {description && (
        <>
          <Text
            style={styles.description}
            numberOfLines={expanded ? undefined : MAX_LINES}
            onTextLayout={(e) => {
              if (e.nativeEvent.lines.length > MAX_LINES) {
                setShowToggle(true);
              }
            }}
          >
            {description}
          </Text>

          {showToggle && (
            <Pressable onPress={() => setExpanded(!expanded)}>
              <Text style={styles.toggle}>
                {expanded ? 'Show less' : 'Read more'}
              </Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    color: '#333',
    lineHeight: 20,
    textAlign: 'left', // avoid justify issues on Android
  },
  toggle: {
    marginTop: 6,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});