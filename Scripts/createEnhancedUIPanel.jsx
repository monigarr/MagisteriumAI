// Enhanced UI Panel Script for After Effects

// and place text layers in specified locations.
// 
// // Function to create and show an enhanced custom UI panel
function createEnhancedUIPanel() {
    // Check if After Effects is running
    if (!app) {
        alert("After Effects is not running.");
        return;
    }

    // Create and show a custom UI panel
    var dialog = new Window("dialog", "Enhanced UI Panel");
    dialog.orientation = "column";
    dialog.alignChildren = "left";

    // Slider controls for layer properties
    var sliderGroup = dialog.add("group");
    sliderGroup.add("statictext", undefined, "Adjust Layer Properties:");

    var opacitySlider = createSlider(sliderGroup, "Opacity", 0, 100, 50);
    var scaleSlider = createSlider(sliderGroup, "Scale", 0, 200, 100);
    var positionSlider = createSlider(sliderGroup, "Position", -500, 500, 0);
    var rotationSlider = createSlider(sliderGroup, "Rotation", -180, 180, 0);

    function createSlider(parent, label, min, max, defaultValue) {
        var sliderGroup = parent.add("group");
        sliderGroup.add("statictext", undefined, label + ":");
        var slider = sliderGroup.add("slider", undefined, defaultValue, min, max);
        var edittext = sliderGroup.add("edittext", undefined, defaultValue.toString());
        slider.onChange = function () {
            edittext.text = slider.value.toFixed(2);
        };
        return slider;
    }

    // Checkbox controls for layer properties
    var checkboxGroup = dialog.add("group");
    checkboxGroup.add("statictext", undefined, "Toggle Layer Properties:");

    var visibilityCheckbox = checkboxGroup.add("checkbox", undefined, "Visibility");
    var motionBlurCheckbox = checkboxGroup.add("checkbox", undefined, "Motion Blur");

    // Dropdown menu for animation presets
    var dropdownGroup = dialog.add("group");
    dropdownGroup.add("statictext", undefined, "Select Animation Preset:");
    var animationDropdown = dropdownGroup.add("dropdownlist", undefined, ["Basic Animation", "Complex Animation", "Custom Animation"]);

    // Text input for dynamic text generation
    var textInputGroup = dialog.add("group");
    textInputGroup.add("statictext", undefined, "Dynamic Text Input:");
    var textInput = textInputGroup.add("edittext", undefined, "Enter text here");

    // Buttons for actions
    var buttonGroup = dialog.add("group");
    var applyButton = buttonGroup.add("button", undefined, "Apply");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    // Event listener for Apply button
    applyButton.onClick = function () {
        applyChanges();
        dialog.close();
    };

    // Function to apply changes to selected layers based on UI input
    function applyChanges() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select or open a composition in After Effects.");
            return;
        }

        // Get selected layers
        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("Please select at least one layer in the composition.");
            return;
        }

        // Apply layer property changes based on UI input
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            if (opacitySlider.value !== undefined) layer.opacity.setValue(opacitySlider.value / 100);
            if (scaleSlider.value !== undefined) layer.scale.setValue([scaleSlider.value / 100, scaleSlider.value / 100]);
            if (positionSlider.value !== undefined) layer.position.setValue([positionSlider.value, layer.position.value[1]]);
            if (rotationSlider.value !== undefined) layer.rotation.setValue(rotationSlider.value);

            if (visibilityCheckbox.value !== undefined) layer.enabled = visibilityCheckbox.value;
            if (motionBlurCheckbox.value !== undefined) layer.motionBlur = motionBlurCheckbox.value;

            // Example: Apply animation preset based on dropdown selection
            switch (animationDropdown.selection.index) {
                case 0: // Basic Animation
                    // Implement basic animation preset logic
                    break;
                case 1: // Complex Animation
                    // Implement complex animation preset logic
                    break;
                case 2: // Custom Animation
                    // Implement custom animation preset logic
                    break;
                default:
                    break;
            }

            // Example: Update text layer content based on user input
            if (textInput.text !== undefined) {
                var textLayer = layer.property("Text").property("Source Text");
                if (textLayer) textLayer.setValue(textInput.text);
            }
        }

        // Success message
        alert("Applied changes to selected layers.");

        // Optionally, add more actions or manipulations here based on UI input
    }

    // Event listener for Cancel button
    cancelButton.onClick = function () {
        dialog.close();
    };

    // Show the dialog window
    dialog.show();
}

// Execute the function to create and show the enhanced custom UI panel
createEnhancedUIPanel();
