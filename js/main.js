fetchLatestBlogs = () => {
    const url = 'https://api.github.com/repos/LapisPhoenix/Blog/contents/pages?sort=author-date-a' +
            'sc';
    let blog_count = 0;
    const banned_ext = [".txt", ".md"]; // Used to ignore certain files, used for custom pages

    fetch(url)
        .then(resp => resp.json())
        .then(files => {
            const message = files.message;
            if (message) {
                if (message === "This repository is empty." || message === "Not Found") {
                    return;
                }
            }

            files.forEach(file => {
                const blogUrl = file.download_url;
                const blogName = file.name;

                if (blogName.includes("index") || banned_ext.some(ext => blogName.includes(ext))) {
                    return;
                }

                fetch(blogUrl).then(resp => {
                    console.log(resp)
                    if (resp.status !== 200) {
                        return;
                    }
                    return resp.text();
                }).then(blog => {
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
                            <a href="/pages/${blogName}">Read more</a>
                        `;

                    document
                        .getElementById("blogs")
                        .appendChild(blogDiv);

                    blog_count++;
                }).catch(err => console.error(err));
            })
        })
        .catch(err => console.error(err));

    if (blog_count === 0) {
        // debug("No blogs found")
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
};

debug = (message) => {
    console.log(`DEBUG - ${message}`);
};

main = () => {
    fetchLatestBlogs();
};

// Execute the main function
main();
