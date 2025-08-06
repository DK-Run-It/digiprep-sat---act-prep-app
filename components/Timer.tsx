import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Clock, Pause, Play, RotateCcw } from "lucide-react-native";
import { Colors } from "@/constants/colors";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  onTimeUpdate?: (remainingTime: number) => void;
  autoStart?: boolean;
  size?: "small" | "medium" | "large";
  showControls?: boolean;
  testID?: string;
}

export const Timer: React.FC<TimerProps> = ({
  initialTime,
  onTimeUp,
  onTimeUpdate,
  autoStart = false,
  size = "medium",
  showControls = true,
  testID,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            onTimeUp && onTimeUp();
            return 0;
          }
          onTimeUpdate && onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onTimeUp, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(initialTime);
  };

  const getTimerStyle = () => {
    switch (size) {
      case "small":
        return styles.smallTimer;
      case "large":
        return styles.largeTimer;
      default:
        return styles.mediumTimer;
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case "small":
        return styles.smallText;
      case "large":
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const getWarningStyle = () => {
    if (timeRemaining <= 60) {
      return styles.dangerText;
    } else if (timeRemaining <= 300) {
      return styles.warningText;
    }
    return {};
  };

  return (
    <View style={[styles.container, getTimerStyle()]} testID={testID}>
      <View style={styles.timerDisplay}>
        <Clock
          size={size === "small" ? 16 : size === "large" ? 24 : 20}
          color={
            timeRemaining <= 60
              ? Colors.error
              : timeRemaining <= 300
              ? Colors.warning
              : Colors.primary
          }
        />
        <Text style={[getTextStyle(), getWarningStyle()]}>
          {formatTime(timeRemaining)}
        </Text>
      </View>
      
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleTimer}
            disabled={timeRemaining === 0}
          >
            {isRunning ? (
              <Pause
                size={size === "small" ? 16 : size === "large" ? 24 : 20}
                color={Colors.primary}
              />
            ) : (
              <Play
                size={size === "small" ? 16 : size === "large" ? 24 : 20}
                color={Colors.primary}
              />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
            <RotateCcw
              size={size === "small" ? 16 : size === "large" ? 24 : 20}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  smallTimer: {
    padding: 4,
  },
  mediumTimer: {
    padding: 8,
  },
  largeTimer: {
    padding: 12,
  },
  timerDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
    color: Colors.textPrimary,
  },
  mediumText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 6,
    color: Colors.textPrimary,
  },
  largeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
    color: Colors.textPrimary,
  },
  warningText: {
    color: Colors.warning,
  },
  dangerText: {
    color: Colors.error,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    padding: 4,
    marginLeft: 8,
  },
});