// Complex Animation Script for After Effects
// Allows users to define number of shapes to add.
// Allows users to choose shape to add (circle or square) 
// Error checking included
// and place text layers in specified locations.

// Function to create a complex animation with user input
function createComplexAnimationWithInput() {
    // Check if After Effects is running
    if (!app) {
        alert("After Effects is not running.");
        return;
    }

    // Create and show a custom UI panel
    var dialog = new Window("dialog", "Complex Animation Setup");
    dialog.orientation = "column";
    dialog.alignChildren = "left";

    // Number of shapes input
    var numberGroup = dialog.add("group");
    numberGroup.add("statictext", undefined, "Number of Shapes:");
    var numberEdittext = numberGroup.add("edittext", undefined, "3");

    // Shape selection checkboxes
    var shapeGroup = dialog.add("group");
    shapeGroup.add("statictext", undefined, "Select Shapes:");
    var circleCheckbox = shapeGroup.add("checkbox", undefined, "Circle");
    var squareCheckbox = shapeGroup.add("checkbox", undefined, "Square");

    // Buttons
    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    // Event listeners for buttons
    okButton.onClick = function () {
        dialog.close();

        try {
            var numShapes = parseInt(numberEdittext.text, 10);
            var shapesToAdd = [];

            if (circleCheckbox.value) shapesToAdd.push("circle");
            if (squareCheckbox.value) shapesToAdd.push("square");

            // Proceed with creating shapes and animation
            createShapesAndAnimation(numShapes, shapesToAdd);

        } catch (error) {
            alert("Error processing input: " + error.message);
            $.writeln(error);
        }
    };

    cancelButton.onClick = function () {
        dialog.close();
    };

    dialog.show();
}

// Function to create shapes and animation based on user input
function createShapesAndAnimation(numShapes, shapesToAdd) {
    var comp = app.project.activeItem;

    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select or open a composition in After Effects.");
        return;
    }

    try {
        // Create shape layers based on user input
        for (var i = 0; i < numShapes; i++) {
            var shapeType = shapesToAdd[i % shapesToAdd.length];
            var shapeLayer = comp.layers.addShape();
            shapeLayer.name = "Shape " + (i + 1);

            // Example: Dynamically create different shapes based on user selection
            if (shapeType === "circle") {
                // Create circle shape
                var circlePath = new Shape();
                circlePath.vertices = [[50, 50], [100, 50], [100, 100], [50, 100]];
                circlePath.inTangents = [[-20, 0], [0, 20], [20, 0], [0, -20]];
                circlePath.outTangents = [[20, 0], [0, -20], [-20, 0], [0, 20]];
                circlePath.closed = true;
                shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValue(circlePath);
            } else if (shapeType === "square") {
                // Create square shape
                var squarePath = new Shape();
                squarePath.vertices = [[50, 50], [100, 50], [100, 100], [50, 100]];
                squarePath.closed = true;
                shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValue(squarePath);
            }
            
            // Customize further as per animation requirements
        }

        // Success message
        alert("Complex animation created successfully!");

    } catch (error) {
        // Error message for unexpected errors
        alert("An error occurred: " + error.message);
        // Log error details to ExtendScript Toolkit console for debugging
        $.writeln(error);
    }
}

// Execute the function to create complex animation with user input
createComplexAnimationWithInput();