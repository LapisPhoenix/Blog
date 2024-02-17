fetchLatestBlogs = () => {
    const url = 'https://api.github.com/repos/LapisPhoenix/Blog/contents/pages?sort=author-date-asc';

    fetch(url)
        .then(resp => resp.json())
        .then(files => {
            const message = files.message();
            if (message) {
                if (message === "This repository is empty.") {
                    // Let the user know that there are no blogs
                    console.log("No blogs found");
                    return;
                }
            }

            files.forEach(file => {
                const blogUrl = file.download_url;
                fetch(blogUrl)
                    .then(resp => resp.text())
                    .then(blog => {
                        // Do something with the blog
                        console.log(blog);
                    })
                    .catch(err => console.error(err));
            })
        })
        .catch(err => console.error(err));
};