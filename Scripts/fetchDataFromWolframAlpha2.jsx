// Function to create and show the UI panel
function createUI() {
    var win = new Window("dialog", "Wolfram Alpha Integration");
    win.alignChildren = "left";

    // Input fields
    var apiKeyGroup = win.add("group");
    apiKeyGroup.add("statictext", undefined, "Wolfram Alpha API App ID:");
    var apiKeyInput = apiKeyGroup.add("edittext", undefined, "");

    var compNameGroup = win.add("group");
    compNameGroup.add("statictext", undefined, "Composition Name:");
    var compNameInput = compNameGroup.add("edittext", undefined, "");

    var widthGroup = win.add("group");
    widthGroup.add("statictext", undefined, "Width (pixels):");
    var widthInput = widthGroup.add("edittext", undefined, "");

    var heightGroup = win.add("group");
    heightGroup.add("statictext", undefined, "Height (pixels):");
    var heightInput = heightGroup.add("edittext", undefined, "");

    var durationGroup = win.add("group");
    durationGroup.add("statictext", undefined, "Duration (seconds):");
    var durationInput = durationGroup.add("edittext", undefined, "");

    var fpsGroup = win.add("group");
    fpsGroup.add("statictext", undefined, "Frame Rate (fps):");
    var fpsInput = fpsGroup.add("edittext", undefined, "");

    var saveLocationGroup = win.add("group");
    saveLocationGroup.add("statictext", undefined, "Save Location:");
    var saveLocationInput = saveLocationGroup.add("edittext", undefined, "");
    var browseButton = saveLocationGroup.add("button", undefined, "Browse...");

    // Button group
    var buttonGroup = win.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    // Button event handlers
    okButton.onClick = function () {
        var userInput = {
            apiKey: apiKeyInput.text,
            compName: compNameInput.text,
            compWidth: parseInt(widthInput.text),
            compHeight: parseInt(heightInput.text),
            compDuration: parseFloat(durationInput.text),
            compFps: parseFloat(fpsInput.text),
            saveLocation: saveLocationInput.text
        };

        if (validateInputs(userInput)) {
            win.close();
            integrateWithWolframAlpha(userInput);
        }
    };

    cancelButton.onClick = function () {
        win.close();
    };

    // Browse button event handler
    browseButton.onClick = function () {
        var folder = Folder.selectDialog("Select a folder to save the .aep file");
        if (folder) {
            saveLocationInput.text = folder.fsName;
        }
    };

    // Show window
    win.show();
}

// Function to validate user inputs
function validateInputs(userInput) {
    if (!userInput.apiKey || !userInput.compName || isNaN(userInput.compWidth) || isNaN(userInput.compHeight) || isNaN(userInput.compDuration) || isNaN(userInput.compFps) || !userInput.saveLocation) {
        alert("Please fill in all fields with valid values.");
        return false;
    }
    return true;
}

// Function to integrate with Wolfram Alpha
function integrateWithWolframAlpha(userInput) {
    try {
        // Implement integration with Wolfram Alpha using user inputs
        var apiAppID = userInput.apiKey;
        var data = fetchDataFromWolframAlpha(apiAppID);
        createCompositionWithData(data, userInput);
        automateRendering();
        transferToPremierePro();
        alert("Integration with Wolfram Alpha successful!");
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Function to fetch data from Wolfram Alpha API (mock function for demonstration)
function fetchDataFromWolframAlpha(apiAppID) {
    // Replace with actual implementation to fetch data from Wolfram Alpha API
    return {
        equations: ["Equation 1: y = x^2", "Equation 2: y = sin(x)"]
    };
}

// Mock functions for After Effects scripting
function createCompositionWithData(data, userInput) {
    alert("Creating composition with data: " + JSON.stringify(data) + "\nUser Inputs: " + JSON.stringify(userInput));
}

function automateRendering() {
    alert("Automating rendering...");
}

function transferToPremierePro() {
    alert("Transferring to Premiere Pro...");
}

// Run the script by creating the UI
createUI();
