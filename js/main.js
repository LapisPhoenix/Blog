fetchLatestBlogs = () => {
    const url = 'https://api.github.com/repos/LapisPhoenix/Blog/contents/pages?sort=author-date-asc';

    fetch(url)
        .then(resp => resp.json())
        .then(files => {
            const message = files.message;
            if (message) {
                if (message === "This repository is empty." || message === "Not Found") {
                    // Let the user know that there are no blogs
                    console.log("No blogs found");
                    return;
                }
            }

            files.forEach(file => {
                const blogUrl = file.download_url;
                const blogName = file.name;

                if (blogName.startsWith("IGNORE_")) {
                    // Skip this blog
                    return;
                }
                fetch(blogUrl)
                    .then(resp => resp.text())
                    .then(blog => {
                        // Line 1 is the title
                        const title = blog.split("\n")[0].trim().split("title: ")[1];
                        // Line 2 is the description
                        const description = blog.split("\n")[1].trim().split("description: ")[1];
                        // Line 3 is the date
                        const date = blog.split("\n")[2].trim().split("date: ")[1];
                        // The rest is the content
                        const content = blog.split("\n").slice(3).join("\n").trim();

                        // For now just print the blog
                        console.log(title);
                        console.log(description);
                        console.log(date);
                        console.log(content);
                    })
                    .catch(err => console.error(err));
            })
        })
        .catch(err => console.error(err));
};

fetchLatestBlogs();