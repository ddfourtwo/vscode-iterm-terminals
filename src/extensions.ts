import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

interface TerminalCommand {
    name: string;
    shouldRunCommands: boolean;
    commands: string[];
    splitDirection?: 'vertical' | 'horizontal';  
}

interface TerminalGroup {
    splitTerminals: TerminalCommand[];
    defaultSplitDirection?: 'vertical' | 'horizontal';  
}

interface TerminalConfig {
    artificialDelayMilliseconds: number;
    keepExistingTerminalsOpen: boolean;
    runOnStartup: boolean;
    defaultSplitDirection: 'vertical' | 'horizontal';  
    terminals: TerminalGroup[];
}

export function activate(context: vscode.ExtensionContext) {
    const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspacePath) return;

    const configPath = path.join(workspacePath, '.vscode', 'iterm-terminals.json');
    
    if (!fs.existsSync(configPath)) return;

    const config: TerminalConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    if (!config.runOnStartup) return;

    let appleScript = 'tell application "iTerm"\n';
    appleScript += 'create window with default profile\n';
    
    config.terminals.forEach((group, groupIndex) => {
        const groupSplitDirection = group.defaultSplitDirection || config.defaultSplitDirection || 'horizontal';
        
        group.splitTerminals.forEach((terminal, termIndex) => {
            const commands = terminal.commands.join(' && ');
            const splitDirection = terminal.splitDirection || groupSplitDirection;
            
            if (termIndex > 0) {
                if (splitDirection === 'vertical') {
                    appleScript += 'tell current session of current window to split vertically with default profile\n';
                } else {
                    appleScript += 'tell current session of current window to split horizontally with default profile\n';
                }
            }
            
            appleScript += `tell current session of current window\n`;
            appleScript += `set name to "${terminal.name}"\n`;
            if (terminal.shouldRunCommands) {
                appleScript += `write text "${commands}"\n`;
            }
            appleScript += 'end tell\n';
            
            if (config.artificialDelayMilliseconds > 0) {
                appleScript += `delay ${config.artificialDelayMilliseconds / 1000}\n`;
            }
        });
    });
    
    appleScript += 'end tell\n';
    
    exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
    });
}

export function deactivate() {}
