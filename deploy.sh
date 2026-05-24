#!/bin/bash
# deploy.sh — atualiza o frontend na VPS
# Uso: scp os arquivos novos para /var/www/dgot-frontend/src/ e rodar esse script
# Ou: copiar o .tar.gz novo e extrair, depois rodar

set -e
export PATH='/root/.bun/bin:/c/Users/gchioka/bin:/mingw64/bin:/usr/local/bin:/usr/bin:/bin:/mingw64/bin:/usr/bin:/c/Users/gchioka/bin:/c/Windows/system32:/c/Windows:/c/Windows/System32/Wbem:/c/Windows/System32/WindowsPowerShell/v1.0:/c/Windows/System32/OpenSSH:/c/Program Files/Microsoft SQL Server/120/Tools/Binn:/c/Program Files/dotnet:/c/Program Files (x86)/Windows Kits/10/Windows Performance Toolkit:/cmd:/c/Users/gchioka/AppData/Local/Programs/Python/Python313/Scripts:/c/Users/gchioka/AppData/Local/Programs/Python/Python313:/c/Users/gchioka/AppData/Local/Microsoft/WindowsApps:/c/Users/gchioka/AppData/Local/Programs/Microsoft VS Code/bin:/c/Users/gchioka/AppData/Local/Programs/Antigravity/bin:/c/Users/gchioka/AppData/Local/Programs/Python/Python313:/mingw64/bin:/usr/bin/vendor_perl:/usr/bin/core_perl:/c/Users/gchioka/AppData/Roaming/Claude/local-agent-mode-sessions/skills-plugin/fccc1bf6-999e-4946-8214-9d20ea54907a/7b0fdf76-ccaa-4aa4-b81f-6d1883ad6fa6/bin:/c/Users/gchioka/AppData/Roaming/Claude/local-agent-mode-sessions/7b0fdf76-ccaa-4aa4-b81f-6d1883ad6fa6/fccc1bf6-999e-4946-8214-9d20ea54907a/rpm/plugin_0155zZVATbJU3jHUmPP9NvMC/bin:/c/Users/gchioka/AppData/Roaming/Claude/local-agent-mode-sessions/7b0fdf76-ccaa-4aa4-b81f-6d1883ad6fa6/fccc1bf6-999e-4946-8214-9d20ea54907a/rpm/plugin_01XXJmxLXPEhPMmnxmrgntNw/bin'

cd /var/www/dgot-frontend

echo '>>> Instalando dependencias...'
bun install --frozen-lockfile

echo '>>> Building...'
bun run vite build --config vite.static.config.ts

echo '>>> Deploy concluido! dist-static/ atualizado.'
