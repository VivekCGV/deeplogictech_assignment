const http = require('http');
const https = require('https');

const websiteUrl = 'https://time.com';

const titleAndLinkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)">\s+<h3 class="latest-stories__item-headline">(.*?)<\/h3>\s* /gi;

function extractTitlesAndLinksFromHtml(html) {
    const titlesAndLinks = [];
    let match;
    let count = 0;

    while ((match = titleAndLinkRegex.exec(html)) !== null && count < 6) {
        // Extract title and link from each match
        const title = match[2];
        const link = websiteUrl + match[1]; // Join base URL with link
        titlesAndLinks.push({ title, link });
        count++;
    }

    return titlesAndLinks;
}

const server = http.createServer((req, res) => {

    //routes 
    if (req.url === "/getTimeStories") {
        // Call the function to extract titles and links

        const protocol = websiteUrl.startsWith('https') ? https : http;

        protocol.get(websiteUrl, (response) => {
            let data = '';

            // A chunk of data has been received.
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                // Extract titles and links using regular expressions
                const titlesAndLinks = extractTitlesAndLinksFromHtml(data);

                //json string
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(titlesAndLinks));
                res.end();
            });
        }).on('error', (error) => {
            console.error('Error fetching website:', error);
        });


    }
});


server.listen(3000)

console.log('Listening on port 3000');
