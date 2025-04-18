// TODO: add report details for compositions, layers, assets
// TODO: update all code comments to be more relevant and integrate with generators
// // Define UI Panel 
var assetManagerUI = new Window("palette", "Asset Manager MoniGarr.com", undefined);

assetManagerUI.orientation = "column";

assetManagerUI.alignChildren = ["fill", "top"];

// Title
var titleText = assetManagerUI.add('statictext', undefined, 'Asset Manager MoniGarr.com');
titleText.graphics.foregroundColor = titleText.graphics.newPen(assetManagerUI.graphics.PenType.SOLID_COLOR, [1, 0.4, 0.8], 1); // Neon pink text
titleText.alignment = ['center', 'top'];

// Dropdown for Team Defaults
var teamDropdown = assetManagerUI.add('dropdownlist', undefined, ['Create Custom Team Defaults', 'Team A Defaults', 'Team B Defaults']);
teamDropdown.selection = 0; // Default selection

// Group for Organizing Layers
var organizeGroup = assetManagerUI.add('panel', undefined, 'Organize Layers');
organizeGroup.alignChildren = ['fill', 'fill'];
var organizeTypeCheckbox = organizeGroup.add('checkbox', undefined, 'Organize by Type');
organizeTypeCheckbox.value = false; // Default unchecked
var organizeFunctionCheckbox = organizeGroup.add('checkbox', undefined, 'Organize by Function');
organizeFunctionCheckbox.value = false; // Default unchecked

// Group for Batch Renaming
var renameGroup = assetManagerUI.add('panel', undefined, 'Batch Rename');
renameGroup.alignChildren = ['fill', 'fill'];
var renameLayersCheckbox = renameGroup.add('checkbox', undefined, 'Rename Layers');
renameLayersCheckbox.value = false; // Default unchecked
var renameCompositionsCheckbox = renameGroup.add('checkbox', undefined, 'Rename Compositions');
renameCompositionsCheckbox.value = false; // Default unchecked
var renameAssetsCheckbox = renameGroup.add('checkbox', undefined, 'Rename Assets');
renameAssetsCheckbox.value = false; // Default unchecked
var renameOptionsText = renameGroup.add('edittext', undefined, '');
renameOptionsText.characters = 30; // Adjust width as needed
var renameMethodDropdown = renameGroup.add('dropdownlist', undefined, ['Append Text', 'Replace Name']);
renameMethodDropdown.selection = 0; // Default selection

// Group for Generating Asset Reports
var reportGroup = assetManagerUI.add('panel', undefined, 'Generate Asset Reports');
reportGroup.alignChildren = ['fill', 'fill'];
var reportLocationText = reportGroup.add('edittext', undefined, 'Export Location');
reportLocationText.characters = 30; // Adjust width as needed
var browseButton = reportGroup.add("button", undefined, "Browse");
browseButton.alignment = ["left", "top"];
var reportFormatDropdown = reportGroup.add('dropdownlist', undefined, ['CSV', 'Text']);
reportFormatDropdown.selection = 0; // Default selection

// Button Group
var buttonGroup = assetManagerUI.add('group');
buttonGroup.alignment = ['center', 'center'];
var okButton = buttonGroup.add('button', undefined, 'OK');
var cancelButton = buttonGroup.add('button', undefined, 'Cancel');

// Event Listeners
okButton.onClick = function() {
    try {
        // Get user choices
        var teamDefaults = teamDropdown.selection.text;
        var batchRenameOptions = renameOptionsText.text;
        var exportLocation = reportLocationText.text;
        var organizeByType = organizeTypeCheckbox.value;
        var organizeByFunction = organizeFunctionCheckbox.value;
        var renameLayers = renameLayersCheckbox.value;
        var renameCompositions = renameCompositionsCheckbox.value;
        var renameAssets = renameAssetsCheckbox.value;
        var renameMethodIndex = renameMethodDropdown.selection.index;
        var renameMethod = (renameMethodIndex === 0) ? "Append" : "Replace";
        var reportFormat = reportFormatDropdown.selection.text;

        // Perform actions based on user choices
        var activeProject = app.project;
        if (activeProject) {
            // Rename layers if selected
            if (renameLayers) {
                renameAllLayers(activeProject, batchRenameOptions, renameMethod);
            }
            // Rename compositions if selected
            if (renameCompositions) {
                renameAllCompositions(activeProject, batchRenameOptions, renameMethod);
            }
            // Rename assets if selected
            if (renameAssets) {
                renameAllAssets(activeProject, batchRenameOptions, renameMethod);
            }
        }

        // Export assets based on user choices
        var selectedCompositions = getSelectedCompositions();
        var selectedLayers = getSelectedLayers();
        var selectedAssets = getSelectedAssets();
        exportAssets(selectedCompositions, selectedLayers, selectedAssets, exportLocation, reportFormat, activeProject);

        // Close the UI
        assetManagerUI.close();
    } catch (e) {
        // Log the error
        $.writeln("Error: " + e.message);
        alert("An error occurred: " + e.message);
    }
};

cancelButton.onClick = function() {
    assetManagerUI.close();
};

browseButton.onClick = function() {
    var exportFolder = Folder.selectDialog("Select Export Folder");
    if (exportFolder != null) {
        reportLocationText.text = exportFolder.fsName;
    }
};

// Function to get selected assets
function getSelectedAssets() {
    var selectedAssets = [];
    var selectedCompositions = getSelectedCompositions();
    for (var i = 0; i < selectedCompositions.length; i++) {
        var composition = selectedCompositions[i];
        for (var j = 1; j <= composition.layers.length; j++) {
            var layer = composition.layers[j];
            if (layer instanceof AVLayer && layer.source && layer.source.file) {
                selectedAssets.push(layer.source.file);
            }
        }
    }
    return selectedAssets;
}

// Function to export assets and generate detailed asset report
function exportAssets(compositions, layers, assets, exportPath, format, project) {
    var renderQueue = project.renderQueue;
    var outputModuleTemplate = (format === 'CSV') ? "CSV" : "Text";
    var reportFile = new File(exportPath + "/AssetReport." + format.toLowerCase());
    var reportText = "Asset Report for Adobe After Effects Project\n\n";

    // Add project details to the report
    reportText += "Project Name: " + project.name + "\n";
    reportText += "Date of Export: " + new Date().toLocaleString() + "\n\n";

    // Add compositions to the report
    reportText += "Compositions:\n";
    for (var i = 0; i < compositions.length; i++) {
        var composition = compositions[i];
        reportText += "Name: " + composition.name + "\n";
        reportText += "Date Modified: " + composition.modified.toString() + "\n";
        reportText += "Location: " + project.file.toString() + "\n";
        reportText += "Layers:\n";
        for (var j = 1; j <= composition.layers.length; j++) {
            var layer = composition.layers[j];
            reportText += "    " + layer.name + "\n";
        }
        reportText += "\n";
    }
    reportText += "\n";

    // Add layers to the report
    reportText += "Layers:\n";
    for (var k = 0; k < layers.length; k++) {
        var layer = layers[k];
        reportText += "Name: " + layer.name + "\n";
        reportText += "Date Modified: " + layer.modified.toString() + "\n";
        reportText += "Location: " + project.file.toString() + "\n";
    }
    reportText += "\n";

    // Add assets to the report
    reportText += "Assets:\n";
    for (var m = 0; m < assets.length; m++) {
        var asset = assets[m];
        reportText += "Name: " + asset.name + "\n";
        reportText += "Date Modified: " + asset.modified.toString() + "\n";
        reportText += "Location: " + asset.file.toString() + "\n";
    }

    // Write report to file
    reportFile.open("w");
    reportFile.write(reportText);
    reportFile.close();
}

// Function to rename all layers in the project
function renameAllLayers(project, prefix, method) {
    for (var i = 1; i <= project.numItems; i++) {
        var item = project.item(i);
        if (item instanceof CompItem) {
            for (var j = 1; j <= item.layers.length; j++) {
                var layer = item.layers[j];
                if (method === "Append") {
                    layer.name = prefix + "_" + layer.name;
                } else if (method === "Replace") {
                    layer.name = prefix;
                }
            }
        }
    }
}

// Function to rename all compositions in the project
function renameAllCompositions(project, prefix, method) {
    for (var i = 1; i <= project.numItems; i++) {
        var item = project.item(i);
        if (item instanceof CompItem) {
            if (method === "Append") {
                item.name = prefix + "_" + item.name;
            } else if (method === "Replace") {
                item.name = prefix;
            }
        }
    }
}

// Function to rename all assets in the project
function renameAllAssets(project, prefix, method) {
    for (var i = 1; i <= project.numItems; i++) {
        var item = project.item(i);
        if (item instanceof FootageItem && item.file) { 
            if (method === "Append") { 
                item.name = prefix + "_" + item.name; 
                
            } else if (method === "Replace") { 
                item.name = prefix; 
                
            } 
            
        } 
        
    } 
    
}

// Function to get selected compositions 
function getSelectedCompositions() { 
    var selectedComps = []; 
    for (var i = 1; i <= app.project.numItems; i++) { 
        var item = app.project.item(i); 
        if (item instanceof CompItem && item.selected) { 
            selectedComps.push(item); 
        } 
    } 
    return selectedComps; 
}

// Function to get selected layers (within selected comps) 
function getSelectedLayers() { 
    var selectedLayers = []; 
    var selectedComps = getSelectedCompositions(); 
    for (var i = 0; i < selectedComps.length; i++) { 
        var comp = selectedComps[i]; 
        for (var j = 1; 
        j <= comp.numLayers; 
        j++) { 
            var layer = comp.layer(j); 
            if (layer.selected) { 
                selectedLayers.push(layer); 
            } 
        } 
    } 
            return selectedLayers; 
}

// Show the UI 
assetManagerUI.show();
