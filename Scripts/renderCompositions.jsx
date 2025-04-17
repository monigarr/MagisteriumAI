// After Effect Automated Rendering Script
//
// Ask user to define number of compositions
// Ask user to specify output folder for all renders

// Function to render compositions
function renderCompositions(numCompositions, outputFolder) {
    // Access active After Effects project
    var project = app.project;

    // Prompt user for output folder if not provided
    if (!outputFolder) {
        outputFolder = promptForFolder("Select output folder for all compositions");
        if (!outputFolder) {
            alert("No output folder selected. Aborting.");
            return;
        }
    }

    // Loop through each composition number specified by the user
    for (var i = 1; i <= numCompositions; i++) {
        // Prompt user for composition name
        var compName = prompt("Enter name for Composition " + i);
        if (!compName) {
            alert("Composition name not provided. Skipping.");
            continue;
        }

        // Find composition in the project by name
        var comp = getCompByName(compName);
        if (comp) {
            // Create a new render queue item and add the composition
            var renderQueueItem = app.project.renderQueue.items.add(comp);

            // Set up the output module
            if (renderQueueItem.outputModules.length > 0) {
                var outputModule = renderQueueItem.outputModule(1); // Default to first output module

                // Apply output module settings (adjust as per your project's requirements)
                if (outputModule) {
                    outputModule.applyTemplate(outputModule.templates[1]); // Adjust index as needed

                    // Set output file path and render settings
                    var file = new File(outputFolder.fsName + "/" + compName + ".mp4"); // Adjust output format if needed
                    outputModule.file = file;

                    // Render with settings
                    app.project.renderQueue.render();
                    
                    // Notify completion
                    alert("Rendering of " + compName + " complete!");
                } else {
                    alert("Output module not found for composition '" + compName + "'.");
                }
            } else {
                alert("No output modules found for composition '" + compName + "'.");
            }
        } else {
            alert("Composition '" + compName + "' not found in project.");
        }
    }
}

// Helper function to prompt user for folder selection
function promptForFolder(promptText) {
    var outputFolder = Folder.selectDialog(promptText);
    return outputFolder;
}

// Helper function to get composition by name
function getCompByName(name) {
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem && app.project.item(i).name === name) {
            return app.project.item(i);
        }
    }
    return null;
}

// Prompt user for number of compositions and output folder
var numCompositions = parseInt(prompt("Enter the number of compositions to render"));
if (!isNaN(numCompositions) && numCompositions > 0) {
    var outputFolder = promptForFolder("Select output folder for all compositions");
    if (outputFolder) {
        // Run the function to start rendering
        renderCompositions(numCompositions, outputFolder);
    } else {
        alert("No output folder selected. Aborting.");
    }
} else {
    alert("Invalid number of compositions. Aborting.");
}