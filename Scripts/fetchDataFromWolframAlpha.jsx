// WIP... To Be Updated after final tests
// Function to prompt user for Wolfram Alpha API credentials
function promptForAPIKey() {
    var apiKey = prompt("Enter your Wolfram Alpha API App ID:", "");

    if (apiKey === null || apiKey === "") {
        throw new Error("API App ID not provided. Script execution cancelled.");
    }

    return apiKey;
}

// Function to fetch data from Wolfram Alpha API
function fetchDataFromWolframAlpha(apiAppID) {
    var query = "calculus"; // Example query, adjust as needed
    var url = "http://api.wolframalpha.com/v1/result?i=" + encodeURIComponent(query) + "&appid=" + encodeURIComponent(apiAppID);
    //var url = "http://api.wolframalpha.com/v1/llm-api?query?input=" + encodeURIComponent(query) + "&appid=" + encodeURIComponent(appId) + "&format=plaintext";

    var curlCommand = 'curl -s -g -k "' + url + '"';

    try {
        var response = system.callSystem(curlCommand);
        return response;
    } catch (e) {
        throw new Error("Error fetching data from Wolfram Alpha API: " + e.message);
    }
}

// Function to create After Effects composition based on fetched data
function createCompositionWithData(data) {
    var proj = app.project;
    if (!proj) {
        proj = app.newProject();
    }

    var compWidth = 1920; // Default width
    var compHeight = 1080; // Default height
    var compDuration = 10; // Default duration in seconds
    var compFps = 30; // Default frame rate
    var compName = "Mathematics Composition"; // Default composition name

    var compName = prompt("Enter composition name:", compName);
    if (!compName) {
        throw new Error("Composition name not provided. Script execution cancelled.");
    }
    var compWidth = parseInt(prompt("Enter composition width (pixels):", compWidth), 10);
    if (!compWidth || isNaN(compWidth)) {
        throw new Error("Invalid composition width. Script execution cancelled.");
    }
    var compHeight = parseInt(prompt("Enter composition height (pixels):", compHeight), 10);
    if (!compHeight || isNaN(compHeight)) {
        throw new Error("Invalid composition height. Script execution cancelled.");
    }
    var compDuration = parseFloat(prompt("Enter composition duration (seconds):", compDuration));
    if (!compDuration || isNaN(compDuration)) {
        throw new Error("Invalid composition duration. Script execution cancelled.");
    }
    var compFps = parseFloat(prompt("Enter composition frame rate (fps):", compFps));
    if (!compFps || isNaN(compFps)) {
        throw new Error("Invalid composition frame rate. Script execution cancelled.");
    }

    var comp = proj.items.addComp(compName, compWidth, compHeight, 1, compDuration, compFps);

    var textLayer = comp.layers.addText(data);
    textLayer.position.setValue([comp.width / 2, comp.height / 2]); // Center text layer

    var projectFile = new File("~/Desktop/" + compName + ".aep"); // Adjust save location as needed
    proj.save(projectFile);
}

// Function to automate rendering tasks
function automateRendering() {
    var proj = app.project;
    if (!proj) {
        throw new Error("No project open. Script execution cancelled.");
    }

    var renderQueue = proj.renderQueue;
    if (!renderQueue) {
        throw new Error("Render queue not available. Script execution cancelled.");
    }

    var comp = proj.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        throw new Error("No active composition found. Script execution cancelled.");
    }

    var render = renderQueue.items.add(comp);
    render.outputModule(1).file = new File("~/Desktop/rendered_video.mov"); // Adjust output file path and format

    renderQueue.render();
}

// Function to transfer compositions to Adobe Premiere Pro
function transferToPremierePro() {
    var proj = app.project;
    if (!proj) {
        throw new Error("No After Effects project open. Script execution cancelled.");
    }

    var projectFile = new File("~/Desktop/" + proj.name);
    proj.save(projectFile);

    alert("Project saved and ready for transfer to Adobe Premiere Pro!");
}

// Main function to execute the integration workflow
function integrateWithWolframAlpha() {
    try {
        var apiAppID = promptForAPIKey();
        var data = fetchDataFromWolframAlpha(apiAppID);
        createCompositionWithData(data);
        automateRendering();
        transferToPremierePro();

        alert("Integration with Wolfram Alpha successful!");
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Run the main function to start the integration process
integrateWithWolframAlpha();
