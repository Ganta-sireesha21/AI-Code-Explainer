async function explainCode() {
    const code = document.getElementById('codeInput').value;
    const output = document.getElementById('output');
    const codeLanguage = document.getElementById('codeLanguage').value;
    const level = document.getElementById('level').value;
    const explaining = document.getElementById('explainLanguage').value;
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loadingText');

    if (!code.trim()) {
        output.textContent = explaining === 'english'
            ? "Please enter some code to explain."
            : "కృపా మీరు వివరించడానికి కొన్ని కోడ్ నమోదు చేయండి.";
        return;
    }

    loading.style.display = 'flex';
    output.style.display = 'none';
    loadingText.textContent = explaining === 'english'
        ? "Explaining code..."
        : "కోడ్ వివరణ...";

    try {
        // ✅ FIXED: Use relative path instead of localhost
        const res = await fetch('/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, codeLanguage, level, explaining })
        });

        if (res.ok) {
            const data = await res.json();
            output.textContent = data.explanation;
        } else {
            const errorData = await res.json();
            output.textContent = errorData.error;
        }

    } catch (error) {
        output.textContent = explaining === 'english'
            ? "An error occurred while explaining the code."
            : "కోడ్ వివరించేటప్పుడు ఒక లోపం సంభవించింది.";
    } finally {
        loading.style.display = 'none';
        output.style.display = 'block';
    }
}

async function pasteCode() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('codeInput').value = text;
    } catch (error) {
        alert("Failed to paste from clipboard. Please try again.");
    }
}

function clearCode() {
    document.getElementById('codeInput').value = '';
    const output = document.getElementById('output');
    const defaultText =
        document.getElementById('explainLanguage').value === 'english'
            ? "Your code explanation will appear here."
            : "మీ కోడ్ వివరణ ఇక్కడ కనిపిస్తుంది.";

    if (output.textContent !== defaultText) {
        output.textContent = defaultText;
    }
}

function copyExplanation() {
    const text = document.getElementById('output').textContent;

    if (
        text === 'Your code explanation will appear here.' ||
        text === 'మీ కోడ్ వివరణ ఇక్కడ కనిపిస్తుంది.'
    ) {
        alert("No explanation to copy.");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Explanation copied to clipboard!");
        })
        .catch((error) => {
            console.log("Failed to copy explanation: ", error);
            alert("Failed to copy explanation. Please try again.");
        });
}