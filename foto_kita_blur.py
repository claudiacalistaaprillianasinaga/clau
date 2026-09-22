"""
Trend TikTok: "Foto kita blur TAPI PAKE PYTHON" 🐍📸✨
Dibuat untuk: Claudia Calista Aprilliana Sinaga

Cara menjalankan (jika menggunakan Python):
1. Install dependensi:
   pip install opencv-python mediapipe numpy
2. Jalankan script:
   python foto_kita_blur.py
3. Pose di depan kamera dan angkat jari ✌️ (Peace Sign) untuk otomatis mem-blur wajah / kamera!
"""

import cv2
import mediapipe as mp
import numpy as np

# Inisialisasi MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.6
)
mp_draw = mp.solutions.drawing_utils

# Buka Kamera (Webcam)
cap = cv2.VideoCapture(0)

def is_peace_gesture(landmarks):
    """
    Mendeteksi apakah tangan membentuk gesture Peace Sign (✌️):
    - Jari Telunjuk (Index) terangkat ke atas
    - Jari Tengah (Middle) terangkat ke atas
    - Jari Manis (Ring) ditekuk ke bawah
    - Jari Kelingking (Pinky) ditekuk ke bawah
    """
    index_up = landmarks[8].y < landmarks[6].y
    middle_up = landmarks[12].y < landmarks[10].y
    ring_down = landmarks[16].y > landmarks[14].y
    pinky_down = landmarks[20].y > landmarks[18].y
    
    return index_up and middle_up and ring_down and pinky_down

print("=" * 55)
print("📸 TREND: Foto Kita Blur Tapi Pake Python Aktif!")
print("✌️ Angkat 2 Jari (Peace Sign) untuk memicu Blur otomatis.")
print("⌨️ Tekan tombol 'q' untuk keluar.")
print("=" * 55)

blur_active = False

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("Kamera tidak terdeteksi.")
        break

    # Cermin frame agar natural (mirror mode)
    frame = cv2.flip(frame, 1)
    h, w, c = frame.shape

    # Konversi BGR ke RGB untuk MediaPipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)

    peace_detected = False

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Gambar landmark tangan
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            # Cek apakah gestur Peace ✌️ aktif
            if is_peace_gesture(hand_landmarks.landmark):
                peace_detected = True

    # Jika peace terdeteksi, aktifkan efek Gaussian Blur
    if peace_detected:
        # Intensitas Gaussian Blur ala aesthetic TikTok
        frame = cv2.GaussianBlur(frame, (55, 55), 35)
        # Indikator teks aesthetic di atas
        cv2.putText(frame, "FOTO KITA BLUR (PEACE ✌ DETECTED)", (30, 50),
                    cv2.FONT_HERSHEY_DUPLEX, 0.85, (255, 64, 129), 2, cv2.LINE_AA)
    else:
        cv2.putText(frame, "Pose Peace 2 Jari ✌ untuk Blur", (30, 50),
                    cv2.FONT_HERSHEY_DUPLEX, 0.75, (255, 255, 255), 2, cv2.LINE_AA)

    # Tampilkan jendela OpenCV
    cv2.imshow("Foto Kita Blur Tapi Pake Python [cv2.imshow]", frame)

    # Tekan 'q' untuk keluar
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
