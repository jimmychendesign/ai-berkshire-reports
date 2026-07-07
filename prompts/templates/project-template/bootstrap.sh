#!/bin/bash

# Project Bootstrap Script

echo "Creating project structure..."

mkdir -p src
mkdir -p public
mkdir -p docs
mkdir -p output/html
mkdir -p output/pdf
mkdir -p output/screenshots
mkdir -p output/exports
mkdir -p prompts
mkdir -p assets

TODAY=$(date +%F)

mkdir -p sessions/$TODAY

touch sessions/$TODAY/session.md
touch sessions/$TODAY/prompts.md
touch sessions/$TODAY/summary.md
touch sessions/$TODAY/todo.md

touch README.md
touch PROJECT.md
touch AGENTS.md

echo ""
echo "✅ Project initialized."
echo "Today's session:"
echo "sessions/$TODAY/"
