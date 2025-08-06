var chats = [];

const responseSection = document.querySelector('.response');
const loader = document.querySelector('.dot-elastic');

function updateResponse(items) {
    // Clear old content
    responseSection.innerHTML = '';

    // Add each item as a paragraph (or list, etc.)
    items.forEach(item => {
        const p = document.createElement('p');
        p.innerHTML = `<span>${item.content}</span>`;
        p.id = item.type;
        responseSection.appendChild(p);
    });
}

document.getElementById('input-search').addEventListener('keydown', addAction.bind(this));

async function addAction($event) {
    if ($event.key === 'Enter') {
        $event.preventDefault();
        const input = $event.target;
        const value = input.value.trim();
        if (value) {

            chats.push({ type: 'user', content: value });
            this.updateResponse(chats);
            summarizeText(value)
            input.value = '';
        }
    }
}


async function summarizeText(userInput) {
    loader.classList.add('show-loader');
    const summarizer = await Summarizer.create({
        sharedContext:
            "A general summary to help a user decide if the text is worth reading",
        type: "tldr",
        length: "long",
        format: "markdown",
        expectedInputLanguages: ["en-US"],
        outputLanguage: "en-US",
    });
    const stream = summarizer.summarizeStreaming(userInput);
    // Stream the response
    let summary = "";
    for await (const chunk of stream) {
        summary += chunk;
        console.log("Summary:", summary);
    }

    // document.querySelector('.dot-elastic').style.display = 'none';
    this.chats.push({ type: 'agent', content: stream });
    loader.classList.remove('show-loader');
    updateResponse(this.chats);
    // summaryOutput.textContent = summary;

}