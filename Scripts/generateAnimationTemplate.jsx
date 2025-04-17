// Function to generate an After Effects animation template with user-defined parameters
function generateAnimationTemplate() {
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
    var templateNameInput = groupName.add("edittext", undefined, "LowerThirdTemplate.aep");
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

    // Add options for logo and text animations
    var groupLogoAnimation = dialog.add("group");
    groupLogoAnimation.orientation = "row";
    var animateLogoCheckbox = groupLogoAnimation.add("checkbox", undefined, "Animate Logo");
    var logoAnimationTypeDropdown = groupLogoAnimation.add("dropdownlist", undefined, ["Fade In/Out", "Scale", "Rotate"]);
    logoAnimationTypeDropdown.enabled = false;

    var groupTitleAnimation = dialog.add("group");
    groupTitleAnimation.orientation = "row";
    var animateTitleCheckbox = groupTitleAnimation.add("checkbox", undefined, "Animate Title Text");
    var titleAnimationTypeDropdown = groupTitleAnimation.add("dropdownlist", undefined, ["Fade In/Out", "Scale", "Typewriter"]);
    titleAnimationTypeDropdown.enabled = false;

    var groupSubtitleAnimation = dialog.add("group");
    groupSubtitleAnimation.orientation = "row";
    var animateSubtitleCheckbox = groupSubtitleAnimation.add("checkbox", undefined, "Animate Subtitle Text");
    var subtitleAnimationTypeDropdown = groupSubtitleAnimation.add("dropdownlist", undefined, ["Fade In/Out", "Slide", "Typewriter"]);
    subtitleAnimationTypeDropdown.enabled = false;

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

    animateLogoCheckbox.onClick = function() {
        logoAnimationTypeDropdown.enabled = animateLogoCheckbox.value;
    };

    animateTitleCheckbox.onClick = function() {
        titleAnimationTypeDropdown.enabled = animateTitleCheckbox.value;
    };

    animateSubtitleCheckbox.onClick = function() {
        subtitleAnimationTypeDropdown.enabled = animateSubtitleCheckbox.value;
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

        // Animate Logo if selected
        if (animateLogoCheckbox.value) {
            animateLogo(comp, logoFile, logoAnimationTypeDropdown.selection.text);
        } else {
            importLogo(comp, logoFile);
        }

        // Create text layers for title and subtitle
        var titleText = prompt("Enter Title Text:", "Title Placeholder");
        var subtitleText = prompt("Enter Subtitle Text:", "Subtitle Placeholder");
        createTextLayers(comp, titleText, subtitleText, animateTitleCheckbox.value, titleAnimationTypeDropdown.selection.text, animateSubtitleCheckbox.value, subtitleAnimationTypeDropdown.selection.text);

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

// Function to animate the logo in the composition
function animateLogo(comp, logoFile, animationType) {
    var logoFootage = app.project.importFile(new ImportOptions(File(logoFile)));
    var logoLayer = comp.layers.add(logoFootage);
    logoLayer.position.setValue([comp.width / 2, comp.height / 2]);

    // Apply animation based on selected type
    switch (animationType) {
        case "Fade In/Out":
            fadeLogo(logoLayer);
            break;
        case "Scale":
            scaleLogo(logoLayer);
            break;
        case "Rotate":
            rotateLogo(logoLayer);
            break;
        default:
            // Default animation if type not recognized
            fadeLogo(logoLayer);
            break;
    }
}

// Function to fade logo in and out
function fadeLogo(logoLayer) {
    var fadeIn = logoLayer.opacity.setValueAtTime(0, 100);
    var fadeOut = logoLayer.opacity.setValueAtTime(2, 0);
}

// Function to scale logo animation
function scaleLogo(logoLayer) {
    logoLayer.scale.setValue([0, 0]);
    logoLayer.scale.setValueAtTime(0, [100, 100]);
    logoLayer.scale.setValueAtTime(2, [150, 150]);
    logoLayer.scale.setValueAtTime(4, [100, 100]);
}

// Function to rotate logo animation
function rotateLogo(logoLayer) {
    logoLayer.rotation.setValue(0);
    logoLayer.rotation.setValueAtTime(0, 0);
    logoLayer.rotation.setValueAtTime(2, 360);
}

// Function to import logo without animation
function importLogo(comp, logoFile) {
    var logoFootage = app.project.importFile(new ImportOptions(File(logoFile)));
    var logoLayer = comp.layers.add(logoFootage);
    logoLayer.position.setValue([comp.width / 2, comp.height / 2]);
}

// Function to create text layers for title and subtitle
function createTextLayers(comp, titleText, subtitleText, animateTitle, titleAnimationType, animateSubtitle, subtitleAnimationType) {
    // Create title text layer
    var titleTextLayer = comp.layers.addText(titleText);
    titleTextLayer.position.setValue([comp.width / 2, comp.height * 0.2]);

    // Create subtitle text layer
    var subtitleTextLayer = comp.layers.addText(subtitleText);
    subtitleText
    
    if (animateTitle) {
    animateText(titleTextLayer, titleAnimationType);
}

if (animateSubtitle) {
    animateText(subtitleTextLayer, subtitleAnimationType);
}

}

// Generic function to animate text layers 
function animateText(textLayer, animationType) 
{ 
    switch (animationType) 
    { 
        case "Fade In/Out": 
            textLayer.opacity.setValueAtTime(0, 0); 
            textLayer.opacity.setValueAtTime(1, 100); 
            textLayer.opacity.setValueAtTime(4, 0); 
            break; 
            
        case "Scale": 
            textLayer.scale.setValueAtTime(0, [0, 0]); 
            textLayer.scale.setValueAtTime(1, [100, 100]); 
            break; 
        
        case "Typewriter": 
            var animator = textLayer.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); 
            var selector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Selector"); 
            var range = selector.property("ADBE Text Range Advanced"); 
            animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0); 
            selector.property("ADBE Text Selector").property("ADBE Text Range Start").setValueAtTime(0, 0); 
            selector.property("ADBE Text Selector").property("ADBE Text Range Start").setValueAtTime(2, 100); 
            break; 
        
    } 
    
}

generateAnimationTemplate();
