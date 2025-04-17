// Function to generate an After Effects template with user-defined parameters
function generateTemplate() {
    // Check if After Effects is running
    if (!app) {
        alert("After Effects is not running.");
        return;
    }

    // Create a dialog window
    var dialog = new Window("dialog", "Template Generation Settings");
    
    // Add text input fields for template settings
    var groupName = dialog.add("group");
    groupName.orientation = "column";
    groupName.add("statictext", undefined, "Template Name (.aep):");
    var templateNameInput = groupName.add("edittext", undefined, "Lower Third Template.aep");
    templateNameInput.characters = 30;

    var groupDuration = dialog.add("group");
    groupDuration.orientation = "column";
    groupDuration.add("statictext", undefined, "Duration (seconds):");
    var durationInput = groupDuration.add("edittext", undefined, "10");
    durationInput.characters = 10;

    var groupWidth = dialog.add("group");
    groupWidth.orientation = "column";
    groupWidth.add("statictext", undefined, "Width (pixels):");
    var widthInput = groupWidth.add("edittext", undefined, "1920");
    widthInput.characters = 10;

    var groupHeight = dialog.add("group");
    groupHeight.orientation = "column";
    groupHeight.add("statictext", undefined, "Height (pixels):");
    var heightInput = groupHeight.add("edittext", undefined, "1080");
    heightInput.characters = 10;

    var groupFPS = dialog.add("group");
    groupFPS.orientation = "column";
    groupFPS.add("statictext", undefined, "Frames Per Second:");
    var fpsInput = groupFPS.add("edittext", undefined, "30");
    fpsInput.characters = 10;

    var groupSaveLocation = dialog.add("group");
    groupSaveLocation.orientation = "row";
    var saveLocationButton = groupSaveLocation.add("button", undefined, "Select Save Location");
    var saveLocationInput = groupSaveLocation.add("edittext", undefined, "");
    saveLocationInput.characters = 30;

    var groupLogoFile = dialog.add("group");
    groupLogoFile.orientation = "row";
    var logoFileButton = groupLogoFile.add("button", undefined, "Select PNG Logo File");
    var logoFileInput = groupLogoFile.add("edittext", undefined, "");
    logoFileInput.characters = 30;

    // Add buttons for OK and Cancel
    var buttonsGroup = dialog.add("group");
    var okButton = buttonsGroup.add("button", undefined, "OK");
    var cancelButton = buttonsGroup.add("button", undefined, "Cancel");

    // Button event handlers
    saveLocationButton.onClick = function() {
        // Prompt user for save location
        var saveLocation = Folder.selectDialog("Select Save Location for Template");
        if (saveLocation !== null) {
            saveLocationInput.text = saveLocation.fsName;
        }
    };

    logoFileButton.onClick = function() {
        // Prompt user to select logo file (PNG file)
        var logoFile = File.openDialog("Select PNG Logo File (*.png)");
        if (logoFile !== null) {
            logoFileInput.text = logoFile.fsName;
        }
    };

    okButton.onClick = function() {
        // Validate inputs
        var templateName = templateNameInput.text;
        var duration = parseFloat(durationInput.text);
        var width = parseInt(widthInput.text);
        var height = parseInt(heightInput.text);
        var fps = parseInt(fpsInput.text);

        if (!templateName || templateName.slice(-4).toLowerCase() !== ".aep" || isNaN(duration) || isNaN(width) || isNaN(height) || isNaN(fps) || duration <= 0 || width <= 0 || height <= 0 || fps <= 0) {
            alert("Invalid input. Please check your entries and try again.");
            return;
        }

        var saveLocation = saveLocationInput.text;
        if (!saveLocation) {
            alert("Please select a save location.");
            return;
        }

        var logoFile = logoFileInput.text;
        if (!logoFile) {
            alert("Please select a PNG logo file.");
            return;
        } else {
            var fileExtension = logoFile.split(".").pop().toLowerCase();
            if (fileExtension !== "png") {
                alert("Invalid file type selected. Please choose a PNG file.");
                return;
            }
        }

        // Create a new composition
        var comp = app.project.items.addComp(templateName, width, height, 1, duration, fps);

        // Create text layer for title placeholder
        var titleText = prompt("Enter Title Text:", "Title Placeholder");
        var titleTextLayer = comp.layers.addText(titleText);
        titleTextLayer.position.setValue([width / 2, height / 2]);
        titleTextLayer.name = "Title";

        // Create text layer for subtitle placeholder
        var subtitleText = prompt("Enter Subtitle Text:", "Subtitle Placeholder");
        var subtitleTextLayer = comp.layers.addText(subtitleText);
        subtitleTextLayer.position.setValue([width / 2, height / 2 + 50]);
        subtitleTextLayer.name = "Subtitle";

        // Import the logo file as footage
        var logoFootage = app.project.importFile(new ImportOptions(File(logoFile)));
        var logoPlaceholder = comp.layers.add(logoFootage);
        logoPlaceholder.position.setValue([width - 150, 75]);

        // Save the template as an After Effects project file
        var projectFile = new File(saveLocation + "/" + templateName);
        app.project.save(projectFile);

        // Success message
        alert("Template created successfully. Saved to: " + projectFile.fsName);

        // Optionally, open the generated project file
        // app.open(projectFile);

        // Close the dialog
        dialog.close();
    };

    cancelButton.onClick = function() {
        // Close the dialog
        dialog.close();
    };

    // Show the dialog
    dialog.show();
}

// Execute the function to generate the After Effects template
generateTemplate();
