# iTerm Terminals Manager

Credit to Ethan Sarif-Kattan for the original idea and implementation.
A VS Code extension that automatically manages iTerm terminal windows and splits based on your workspace configuration. Perfect for developers who need to set up multiple terminal windows with specific configurations and commands on project startup.

## Features

- Automatically opens iTerm windows with predefined splits
- Configures terminal names for easy identification
- Executes predefined commands in each terminal
- Supports horizontal and vertical terminal splits
- Configurable startup behavior and delays

## Requirements

- macOS
- iTerm2 installed
- Visual Studio Code or Windsurf

## Installation

1. Download the `.vsix` file from the releases
2. Install using VS Code or Windsurf:
   ```bash
   windsurf --install-extension vscode-iterm-terminals-0.0.1.vsix
   ```

## Configuration

Create a `.vscode/iterm-terminals.json` file in your workspace with the following structure:

```json
{
    "artificialDelayMilliseconds": 500,
    "keepExistingTerminalsOpen": true,
    "runOnStartup": true,
    "defaultSplitDirection": "horizontal",
    "terminals": [
        {
            "defaultSplitDirection": "vertical",
            "splitTerminals": [
                {
                    "name": "Server",
                    "shouldRunCommands": true,
                    "commands": [
                        "cd server",
                        "npm start"
                    ]
                },
                {
                    "name": "Client",
                    "shouldRunCommands": true,
                    "commands": [
                        "cd client",
                        "npm run dev"
                    ],
                    "splitDirection": "horizontal"
                }
            ]
        }
    ]
}
```

### Configuration Options

- `artificialDelayMilliseconds`: Delay between terminal operations (useful for slower systems)
- `keepExistingTerminalsOpen`: Whether to keep existing terminals when opening new ones
- `runOnStartup`: Automatically run the terminal configuration when the workspace opens
- `defaultSplitDirection`: Global default split direction ("horizontal" or "vertical")
- `terminals`: Array of terminal groups
  - `defaultSplitDirection`: Optional group-level split direction override
  - `splitTerminals`: Array of terminal configurations within a group
    - `name`: Display name for the terminal
    - `shouldRunCommands`: Whether to execute the commands
    - `commands`: Array of commands to run in sequence
    - `splitDirection`: Optional terminal-specific split direction override

## Usage

1. Create a `.vscode/iterm-terminals.json` file in your workspace
2. Configure your terminal settings as shown above
3. Open your workspace in VS Code/Windsurf
4. The extension will automatically open iTerm with your configured terminals if `runOnStartup` is `true`
5. Alternatively, use the command palette (Cmd+Shift+P) and search for "Open iTerm Terminals"

## Example Configuration

Here's a practical example for a full-stack development setup:

```json
{
    "artificialDelayMilliseconds": 500,
    "keepExistingTerminalsOpen": true,
    "runOnStartup": true,
    "defaultSplitDirection": "horizontal",
    "terminals": [
        {
            "defaultSplitDirection": "vertical",
            "splitTerminals": [
                {
                    "name": "Backend",
                    "shouldRunCommands": true,
                    "commands": [
                        "cd backend",
                        "npm install",
                        "npm run dev"
                    ]
                },
                {
                    "name": "Frontend",
                    "shouldRunCommands": true,
                    "commands": [
                        "cd frontend",
                        "npm install",
                        "npm start"
                    ]
                },
                {
                    "name": "Git",
                    "shouldRunCommands": true,
                    "commands": [
                        "git status"
                    ],
                    "splitDirection": "horizontal"
                }
            ]
        }
    ]
}
```

## Split Direction Configuration

The extension supports both horizontal and vertical splits with three levels of configuration:

1. **Global Level** (`defaultSplitDirection`): Set in the root of the config file, applies to all terminals unless overridden
2. **Group Level** (`defaultSplitDirection`): Set per terminal group, overrides the global setting
3. **Terminal Level** (`splitDirection`): Set per individual terminal, overrides both global and group settings

This hierarchical configuration allows for flexible layout customization. For example:
- Set horizontal splits globally
- Override specific groups to use vertical splits
- Further customize individual terminals within groups

## Known Issues

- All terminals in a group must be part of the same iTerm window

## Contributing

Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/ddfourtwo/vscode-iterm-terminals).

## License

This extension is licensed under the MIT License.
