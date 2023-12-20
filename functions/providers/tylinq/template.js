function getTemplate(loaderVisible, redirectUrl) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Add your loader styles here */
            #loader {
                border: 16px solid #f3f3f3;
                border-top: 16px solid #3498db;
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
                margin: auto;
                margin-top: 50px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }
        </style>
    </head>
    <body>
        <center>
            <h1>الرجاء الانتظار قليلا</h1>
            ${loaderVisible ? '<div id="loader"></div>' : ''}
        </center>

        <script>
            // Handle redirection logic here
            ${redirectUrl ? `window.location.href = '${redirectUrl}';` : ''}
        </script>
    </body>
    </html>`;
}

module.exports.getTemplate = getTemplate;