# **App Name**: CaptionCast

## Core Features:

- SRT Input: Accept a live SRT stream URL as input.
- Teletext Extraction: Extract Teletext page 888 (English subtitles) from the SRT stream.
- Real-time Translation: Translate the extracted English subtitles to German on-the-fly using an AI tool, powered by Ollama.
- Subtitle Burn-in: Burn-in the translated German subtitles into the video stream.
- Stream Output & Control: Provide output via SRT stream and HLS, with an advanced Web UI for control and monitoring the stream.

## Style Guidelines:

- Primary color: A muted blue (#6699CC), reminiscent of broadcast television, lending a professional and reliable feel.
- Background color: A dark gray (#333333) to provide high contrast with the subtitles and controls.
- Accent color: A vibrant yellow (#FFD700) to highlight active controls and status indicators.
- Clear, sans-serif font for both the UI and burned-in subtitles, ensuring legibility.
- Simple, recognizable icons for stream control (play, pause, stop) and settings.
- Clean, modular layout with distinct sections for input configuration, translation settings, and output monitoring.
- Subtle transitions and loading animations to provide feedback without being distracting.