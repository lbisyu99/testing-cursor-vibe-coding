@echo off
echo Initializing Git repository...
git init

echo Adding remote repository...
git remote add origin https://github.com/lbisyu99/testing-cursor-vibe-coding.git

echo Adding files to Git...
git add .

echo Committing files...
git commit -m "Initial commit: Modern portfolio website"

echo Pushing to GitHub...
git push -u origin master

echo Done!
pause 