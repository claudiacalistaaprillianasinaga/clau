#include <Arduino.h>

#ifndef RGB_BUILTIN
  #define RGB_BUILTIN 8
#endif

const uint8_t BRIGHTNESS = 80;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("ESP32-C3 LED Biru - PlatformIO");
  neopixelWrite(RGB_BUILTIN, 0, 0, BRIGHTNESS);
}

void loop() {
  neopixelWrite(RGB_BUILTIN, 0, 0, BRIGHTNESS);
  delay(1000);
}
