const vscode = require('vscode');
const path = require('path')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('kingame96.GenerateQPROPERTY', function () {
		var editor = vscode.window.activeTextEditor;
		
		if (editor) {
			vscode.window.showInputBox({ ignoreFocusOut: true, placeHolder: "Enter QPROPERTY variable name" }).then(variableString => {

				let document = editor.document;
			
				let selection_1 = editor.selection;
				
				let word = document.getText(selection_1);
				
				let variableSplit = variableString.split(/\s+/);
				let variableType = variableSplit[0];
				let variableName = variableSplit[1];
				let writeProperty = "set" + variableName[0].toUpperCase() + variableName.substring(1, variableName.length);
				let newVariableName = "new" + variableName[0].toUpperCase() + variableName.substring(1, variableName.length);
				let notifyProperty = variableName + "Changed";
				
				let qproperty = "Q_PROPERTY(" + variableType + " " + variableName + " READ " + variableName + " WRITE " + writeProperty + " NOTIFY " + notifyProperty + ")\n\n";
				
				let memberVariable = "m_" + variableName;
				let privateVariable = variableType +  " " + memberVariable + ";\n";
				qproperty += (privateVariable + "\n");

				let getFunc = variableType + " " + variableName + "() const;\n";
				qproperty += (getFunc);

				let writeFunc = "void " + writeProperty + "(" + variableType + " " + newVariableName + ");\n";
				qproperty += (writeFunc + "\n");

				let slotFunc = notifyProperty + "();\n";
				qproperty += ("void " + slotFunc + "\n");

				let getFuncDeclaration 	= variableType + " " + variableName + "() const\n";
				getFuncDeclaration		+= "{\n"
										+  "	return " +  memberVariable + ";\n"
										+  "}\n";
				qproperty += (getFuncDeclaration + "\n");

				let setFunctionDeclaration = "void " + writeProperty + "(" + variableType + " " + newVariableName + ")\n";
				setFunctionDeclaration		+= "{\n"
											+  "\tif (" + memberVariable + " != " + newVariableName + ") {\n"
											+  "\t\t" + memberVariable + " = " + newVariableName + ";\n"
											+  "\t\temit " + slotFunc
											+  "\t}\n"
											+  "}\n"; 
				qproperty += setFunctionDeclaration;

				let qpropertyTab = qproperty.split('\n').map(line => '\t' + line).join('\n');

				console.log(qpropertyTab);

				editor.edit(function (editBuilder) {
					editBuilder.replace(selection_1, qpropertyTab);
				});
			});

			
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
