// Dynamic Text Generation Script for After Effects
// Allows users to import text data from CSV, JSON, or text file 
// and place text layers in specified locations.

// Function to import data from CSV file
function importDataFromCSV(filePath) {
    var file = new File(filePath);
    file.open("r");
    var content = file.read();
    file.close();
    
    // Parse CSV data (assuming comma-separated values)
    var data = [];
    var lines = content.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line !== "") {
            var values = line.split(",");
            data.push(values);
        }
    }
    
    return data;
}

// Function to import data from JSON file
function importDataFromJSON(filePath) {
    var file = new File(filePath);
    file.open("r");
    var content = file.read();
    file.close();
    
    // Parse JSON data
    var data = JSON.parse(content);
    return data;
}

// Function to import data from text file
function importDataFromText(filePath) {
    var file = new File(filePath);
    file.open("r");
    var content = file.read();
    file.close();
    
    // Split text data by lines
    var data = content.split("\n");
    return data;
}

// Function to create text layer in specified location
function createTextLayer(textContent, position) {
    var comp = app.project.activeItem;
    if (comp && comp instanceof CompItem) {
        var textLayer = comp.layers.addText(textContent);
        // Adjust text layer properties based on position
        switch (position.toLowerCase()) {
            case "lower thirds":
                // Adjust position for lower thirds
                textLayer.position.setValue([comp.width / 2, comp.height - 50]);
                break;
            case "captions":
                // Adjust position for captions
                textLayer.position.setValue([comp.width / 2, comp.height - 100]);
                break;
            case "upper right corner":
                // Adjust position for upper right corner
                textLayer.position.setValue([comp.width - 50, 50]);
                break;
            case "upper left corner":
                // Adjust position for upper left corner
                textLayer.position.setValue([50, 50]);
                break;
            case "upper center":
                // Adjust position for upper center
                textLayer.position.setValue([comp.width / 2, 50]);
                break;
            case "center":
                // Adjust position for center
                textLayer.position.setValue([comp.width / 2, comp.height / 2]);
                break;
            default:
                // Default to center if position not recognized
                textLayer.position.setValue([comp.width / 2, comp.height / 2]);
                break;
        }
    }
}

// Function to prompt user for file selection
function promptForFile(promptText) {
    var file = File.openDialog(promptText);
    return file;
}

// Prompt user to select data source file (CSV, JSON, or text)
var file = promptForFile("Select data source file (CSV, JSON, or text)");
if (file) {
    var filePath = file.fsName;
    
    // Prompt user to select text layer position
    var position = prompt("Select text layer position (lower thirds, captions, upper right corner, upper left corner, upper center, center)");
    
    // Import data based on file extension
    var data;
    var fileExtension = file.name.split(".").pop().toLowerCase();
    switch (fileExtension) {
        case "csv":
            data = importDataFromCSV(filePath);
            break;
        case "json":
            data = importDataFromJSON(filePath);
            break;
        case "txt":
            data = importDataFromText(filePath);
            break;
        default:
            alert("Unsupported file format. Please select a CSV, JSON, or text file.");
            break;
    }
    
    // Create text layers based on imported data
    if (data) {
        for (var i = 0; i < data.length; i++) {
            var textContent = data[i];
            createTextLayer(textContent, position);
        }
    }
} else {
    alert("No file selected. Script aborted.");
}