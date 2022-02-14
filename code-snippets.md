# Code snippets

## CURL request for token

curl -X POST http://localhost:5000/token -H "Content-Type: application/json" -d '{"identity": "Sarah"}'

## Video Room Monitor

<script src="https://cdn.jsdelivr.net/npm/@twilio/video-room-monitor/dist/browser/twilio-video-room-monitor.js"></script>

      Twilio.VideoRoomMonitor.registerVideoRoom(room);
      Twilio.VideoRoomMonitor.openMonitor();

## Diagnostic app URL

https://rtc-diagnostics-video-1x6zv5vy-3924-dev.twil.io

## Video Processors Demo

https://twilio.github.io/twilio-video-processors.js/examples/virtualbackground/