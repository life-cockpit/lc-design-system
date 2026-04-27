#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MCP_DIR="$SCRIPT_DIR/.."
INFRA_DIR="$SCRIPT_DIR"
ROOT_DIR="$SCRIPT_DIR/../../.."

STACK="${1:-all}"

if [[ "$STACK" == "mcp" || "$STACK" == "all" ]]; then
  echo "📦 Building MCP Lambda bundle..."
  cd "$MCP_DIR"

  npx esbuild src/lambda.ts src/server.ts \
    --bundle \
    --platform=node \
    --target=node20 \
    --format=esm \
    --outdir=dist \
    --out-extension:.js=.mjs \
    --external:@aws-sdk/* \
    --banner:js="import{createRequire}from'module';const require=createRequire(import.meta.url);"

  cp "$ROOT_DIR/libs/ui-kit/component-metadata.json" "$MCP_DIR/dist/"
  echo "✅ MCP bundle ready"
fi

if [[ "$STACK" == "docs" || "$STACK" == "all" ]]; then
  echo "📦 Building Demo App..."
  cd "$ROOT_DIR"
  npx nx build demo --configuration=production
  echo "✅ Demo App build ready"
fi

echo ""
echo "🚀 Deploying with CDK..."
cd "$INFRA_DIR"

if [[ "$STACK" == "all" ]]; then
  npx cdk deploy --all --require-approval never
elif [[ "$STACK" == "mcp" ]]; then
  npx cdk deploy LifeCockpitMcpServer --require-approval never
elif [[ "$STACK" == "docs" ]]; then
  npx cdk deploy LifeCockpitDocs --require-approval never
else
  echo "Usage: ./deploy.sh [mcp|docs|all]"
  exit 1
fi
