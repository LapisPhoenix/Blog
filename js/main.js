fetchLatestBlogs = async () => {
    const url = 'https://api.github.com/repos/LapisPhoenix/Blog/contents/pages?sort=author-date-asc';
    let blog_count = 0;
    const banned_ext = [".txt", ".md"]; // Used to ignore certain files, used for custom pages

    try {
        const resp = await fetch(url);
        const files = await resp.json();

        const message = files.message;
        if (message) {
            if (message === "This repository is empty." || message === "Not Found") {
                return;
            }
        }

        for (const file of files) {
            const blogUrl = file.download_url;
            const blogName = file.name;

            if (blogName.includes("index") || banned_ext.some(ext => blogName.includes(ext))) {
                continue;
            }

            const resp = await fetch(blogUrl);
            // console.log(resp);
            if (resp.status !== 200) {
                continue;
            }

            const blog = await resp.text();
            const title = blog
                .split("\n")[0]
                .replace("<!-- ", "")
                .replace(" -->", "")
                .trim()
                .split("title: ")[1];
            const description = blog
                .split("\n")[1]
                .replace("<!-- ", "")
                .replace(" -->", "")
                .trim()
                .split("description: ")[1];
            const date = blog
                .split("\n")[2]
                .replace("<!-- ", "")
                .replace(" -->", "")
                .trim()
                .split("date: ")[1];

            // Add the blog to the page
            const blogDiv = document.createElement("div");
            blogDiv
                .classList
                .add("blog");
            blogDiv.innerHTML = `
                    <h2>${title}</h2>
                    <p>${description}</p>
                    <p>${date}</p>
                    <a href="/Blog/pages/${blogName}">Read more</a>
                `;

            document
                .getElementById("blogs")
                .appendChild(blogDiv);

            blog_count++;
        }

        if (blog_count === 0) {
            // debug("No blogs found")
            // debug(blog_count)
            const blogDiv = document.createElement("div");
            blogDiv
                .classList
                .add("blog");
            blogDiv.innerHTML = `
                <h2>No blogs found</h2>
                <p>There are no blogs to display at the moment, Try again later!</p>
            `;
            document
                .getElementById("blogs")
                .appendChild(blogDiv);
        }
    } catch (err) {
        console.error(err);
    }
};


getLastUpdated = async () => {
    const url = 'https://api.github.com/repos/LapisPhoenix/Blog';

    fetch(url)
        .then(response => response.json())
        .then (data => {
            const lastUpdated = data.updated_at.toString().split("T")[0];
            const lastUpdatedDiv = document.getElementById("update");
            lastUpdatedDiv.innerHTML = `Last updated: ${lastUpdated} (YYYY-MM-DD)`;
        })
        .catch(err => {
            console.error("Error fetching last updated date: ", err);
            const lastUpdatedDiv = document.getElementById("update");
            lastUpdatedDiv.innerHTML = "Last updated: Error fetching last updated date";
        })
};


debug = (message) => {
    console.log(`DEBUG - ${message}`);
};

main = async () => {
    await getLastUpdated();
    await fetchLatestBlogs();
};


// Execute the main function
main();
