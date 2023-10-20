import * as vscode from "vscode";

const customChannel = vscode.window.createOutputChannel("Metaversx Console");

// Register a command to open the custom tab
vscode.commands.registerCommand("extension.openOutput", () => {
  customChannel.show();
});

// Function to execute a command in the custom console
function runCustomCommand(command: string) {
  customChannel.appendLine(`Running command: ${command}`);
  // Add your code here to execute the command and capture its output
  customChannel.appendLine(`Running command: ${command}`);

  // Execute the command and capture its output
  const terminal =
    vscode.window.terminals.find(
      (terminal: vscode.Terminal) => terminal.name === "Multiversx Scripts"
    ) || vscode.window.createTerminal("Multiversx Scripts");
  // clear the terminal
  terminal.sendText("clear");
  terminal.sendText(
    command,
    command == "npx mxjs-wallet --help" ||
      command == "npm i -g @multiversx/sdk-wallet-cli"
  );
  terminal.show();

  terminal.processId.then((pid) => {
    customChannel.appendLine(`Command executed with PID: ${pid}`);
  });
}

// Register a command to run a command in the custom console
vscode.commands.registerCommand("extension.runCustomCommand", (args: any) => {
  vscode.window
    .showInputBox({
      placeHolder: "Enter a command to run in the custom console",
    })
    .then((command) => {
      if (command) {
        runCustomCommand(command);
      }
    });
});

export function activate(context: vscode.ExtensionContext) {
  // Create a tree data provider
  const treeDataProvider = new TreeDataProvider();

  // Register the tree data provider with VS Code
  vscode.window.registerTreeDataProvider("explorerTree", treeDataProvider);

  // Register a command to be executed when the "Run Command" button is clicked
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runCommand", (args: string) => {
      runCustomCommand(args);
      vscode.window.showInformationMessage("Command executed in the console.");
    })
  );
}

// Tree data provider class
class TreeDataProvider implements vscode.TreeDataProvider<TreeNode> {
  onDidChangeTreeData?: vscode.Event<TreeNode | undefined | null | void>;

  getTreeItem(element: TreeNode): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TreeNode): Thenable<TreeNode[]> {
    if (!element) {
      let node1 = new TreeNode(
        "Derive key",
        "Derive key from mnemonic, password and file",
        "extension.runCommand"
      );
      // Root level items
      node1.command = {
        command: "extension.runCommand",
        title: "Derive key",
        arguments: [
          "npx mxjs-wallet derive-key -k key.txt -m file.txt -p pass.txt",
        ],
      };

      let node2 = new TreeNode(
        "Sign",
        "Sign Transaction",
        "extension.runCommand"
      );
      let node3 = new TreeNode(
        "New Mnemonic",
        "Verify Transaction",
        "extension.runCommand"
      );
      let node4 = new TreeNode("Help", "Help", "extension.runCommand");
      let node5 = new TreeNode(
        "Install Multiversx JS CLI",
        "Install Multiversx JS CLI",
        "extension.runCommand"
      );

      node2.command = {
        command: "extension.runCommand",
        title: "Sign",
        arguments: [
          "npx mxjs-wallet sign -i tests/testdata/txAliceToCarol.json -o out.txt -k key.txt -p pass.txt",
        ],
      };

      node3.command = {
        command: "extension.runCommand",
        title: "New Mnemonic",
        arguments: ["npx mxjs-wallet new-mnemonic -m file.txt"],
      };

      node4.command = {
        command: "extension.runCommand",
        title: "Help",
        arguments: ["npx mxjs-wallet --help"],
      };

      node5.command = {
        command: "extension.runCommand",
        title: "Install Multiversx JS CLI",
        arguments: ["npm i -g @multiversx/sdk-wallet-cli"],
      };

      return Promise.resolve([node5, node3, node2, node1, node4]);
    }

    return Promise.resolve([]);
  }
}

// Tree node class
class TreeNode extends vscode.TreeItem {
  constructor(
    label: string,
    private readonly commandTitle: string,
    private readonly commandId: string
  ) {
    super(label);
    this.command = {
      title: this.commandTitle,
      command: this.commandId,
    };
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
