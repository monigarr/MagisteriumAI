// Function to create a simple animation with error handling and optimization
function createSimpleAnimation() {
    // Check if After Effects is running
    if (!app) {
        alert("After Effects is not running.");
        return;
    }

    // Check if a composition is open and active
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select or open a composition in After Effects.");
        return;
    }

    try {
        // Create layers, apply effects, and animate properties
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = "Animated Shape";

        // Example: Animating scale and position
        var scaleProperty = shapeLayer.property("Transform").property("Scale");
        scaleProperty.setValueAtTime(0, [0, 0]);
        scaleProperty.setValueAtTime(2, [100, 100]);
        scaleProperty.setValueAtTime(4, [50, 50]);

        var positionProperty = shapeLayer.property("Transform").property("Position");
        positionProperty.setValueAtTime(0, [comp.width / 2, comp.height / 2]);
        positionProperty.setValueAtTime(4, [comp.width / 2 + 200, comp.height / 2]);

        // Apply keyframes and expressions for dynamic animations
        // Example: Expression to create bouncing animation
        positionProperty.expression = "amp = 50;\nfreq = 2.0;\ndecay = 3.0;\n\nn = 0;\nif (numKeys > 0){\nn = nearestKey(time).index;\nif (key(n).time > time){\nn--;\n}\n}\n\nif (n == 0){\nt = 0;\n}else{\nt = time - key(n).time;\n}\n\nif (n > 0 && t < 1){\nv = velocityAtTime(key(n).time - thisComp.frameDuration/10);\nvalue + v*(amp/100)*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n}else{\nvalue;\n}";

        // Success message
        alert("Simple animation created successfully!");

    } catch (error) {
        // Error message for unexpected errors
        alert("An error occurred: " + error.message);
        // Log error details to ExtendScript Toolkit console for debugging
        $.writeln(error);
    }
}

// Execute the function to create the simple animation
createSimpleAnimation();
