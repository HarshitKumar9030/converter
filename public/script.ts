document.getElementById('upload-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const outputFormatSelect = document.getElementById('output-format') as HTMLSelectElement;
    const file = fileInput.files?.[0];
    const outputFormat = outputFormatSelect.value;

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('outputFormat', outputFormat);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        if (result.success) {
            resultDiv.innerHTML = `<a href="${result.url}" download>Download Converted ${outputFormat.toUpperCase()} File</a>`;
        } else {
            resultDiv.textContent = 'Conversion failed. Please try again.';
        }
    }
});
