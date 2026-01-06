@echo off
echo Adding Node.js to PATH for this session...
SET PATH=%PATH%;C:\Program Files\nodejs

echo Starting Development Server...
npm run dev
pause
