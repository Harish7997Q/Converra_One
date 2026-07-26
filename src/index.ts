/**
 * Converra One - Intelligent Communication Workspace
 * Tagline: Where Conversations Converge.
 * 
 * Main entry point for the Converra One MCP server.
 * Uses NitroStack @McpApp decorator pattern for scalable, clean architecture.
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module.js';

function logWidgetStatus() {
  console.log('=== NitroStack Widget Diagnostic Logging ===');
  console.log(`Current Working Directory (CWD): ${process.cwd()}`);
  
  const widgetsOutDir = path.resolve('src/widgets/out');
  console.log(`Resolved Widget Out Directory: ${widgetsOutDir}`);
  
  if (fs.existsSync(widgetsOutDir)) {
    console.log('✓ Widget Out Directory exists.');
    try {
      const files = fs.readdirSync(widgetsOutDir);
      console.log(`Found ${files.length} items in widgets/out:`);
      files.forEach((file) => {
        const fullPath = path.join(widgetsOutDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const subFiles = fs.readdirSync(fullPath);
          console.log(`  - [DIR]  ${file} (contains ${subFiles.length} files: ${subFiles.join(', ')})`);
        } else {
          console.log(`  - [FILE] ${file} (${stat.size} bytes)`);
        }
      });
    } catch (e: any) {
      console.error(`Error reading widgets/out directory: ${e.message}`);
    }
  } else {
    console.log('❌ Widget Out Directory DOES NOT exist at ' + widgetsOutDir);
    const widgetsDir = path.resolve('src/widgets');
    if (fs.existsSync(widgetsDir)) {
      console.log('✓ Parent widgets directory exists.');
      try {
        console.log(`Items in src/widgets: ${fs.readdirSync(widgetsDir).join(', ')}`);
      } catch (e: any) {
        console.error(`Error reading src/widgets directory: ${e.message}`);
      }
    } else {
      console.log('❌ Parent widgets directory DOES NOT exist at ' + widgetsDir);
    }
  }
  console.log('============================================');
}

/**
 * Bootstrap the Converra One application
 */
async function bootstrap() {
  logWidgetStatus();
  const server = await McpApplicationFactory.create(AppModule);
  await server.start();
}

// Start the application
bootstrap().catch((error) => {
  console.error('❌ Failed to start Converra One server:', error);
  process.exit(1);
});
