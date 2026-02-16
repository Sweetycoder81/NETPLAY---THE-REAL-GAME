# NETPLAY - Git Setup Script
# Run this script after installing Git

echo "Setting up NETPLAY repository..."

# Initialize Git repository
git init

# Add remote repository
git remote add origin https://github.com/Sweetycoder81/NETPLAY---The-Real-Game.git

# Create .gitignore file
cat > .gitignore << EOL
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
EOL

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: NETPLAY Gaming HUD with React + TypeScript

Features:
- Hardcore Gaming HUD design with Framer Motion animations
- Mouse-tracking radial gradient background
- Orbitron font for gaming aesthetics
- Neon border beam effects on cards
- Glitch text animations on buttons
- Shuttlecock scroll animation
- Glassmorphism 2.0 cards with hover effects
- Enhanced sidebar with gaming terminology
- System status panel and player profile
- Responsive design with Tailwind CSS

Tech Stack:
- React 19 with TypeScript
- Framer Motion for animations
- Tailwind CSS with custom colors
- React Router for navigation
- Axios for API integration"

# Push to GitHub
git branch -M main
git push -u origin main

echo "✅ Repository setup complete!"
echo "🔗 Your code is now at: https://github.com/Sweetycoder81/NETPLAY---The-Real-Game"
