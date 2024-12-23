// URL of the external file
const fileUrl = "https://raw.githubusercontent.com/edoardo100/redattolo_autofill/refs/heads/main/wordlist.txt"; // Replace with the actual URL

// Function to fetch and parse words from an external file
const fetchWords = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        
        const text = await response.text();
        // Parse based on the file format
        const wordList = text.includes("[") ? JSON.parse(text) : text.split("\n").map(word => word.trim()).filter(Boolean);
        return wordList;
    } catch (error) {
        console.error("Error fetching words:", error);
        return [];
    }
};

// Main autofill function
const autofillWords = async () => {
    const inputField = document.querySelector(".css-cz7i3t"); // Adjust the selector if needed
    if (!inputField) {
        console.error("Input field not found! Check the class or DOM structure.");
        return;
    }

    console.log("Input field found!");
    const words = await fetchWords(fileUrl);

    if (!words.length) {
        console.error("No words fetched. Check the file or URL.");
        return;
    }

    console.log("Words fetched:", words);

    // Autofill function
    const fillWords = async (wordList, index = 0) => {
        if (index >= wordList.length) return;

        const word = wordList[index];

        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")
            .set.call(inputField, word);

        // Trigger input event
        const inputEvent = new Event("input", { bubbles: true });
        inputField.dispatchEvent(inputEvent);

        console.log(`Autofill value set: ${inputField.value}`);

        // Simulate pressing Enter
        const enterKeyEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            bubbles: true,
        });
        inputField.dispatchEvent(enterKeyEvent);

        console.log("Enter key pressed");

        // Delay to mimic human interaction
        setTimeout(() => fillWords(wordList, index + 1), 500);
    };

    // Start the autofill process
    fillWords(words);
};

// Run the autofill function
autofillWords();