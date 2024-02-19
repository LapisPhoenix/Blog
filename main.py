import os
import time
import markdown
from bs4 import BeautifulSoup as bs


def convert_markdown_to_html(file):
    with open(file, 'r', encoding='utf-8') as f:
        text = f.read()
        # The first 3 lines are the title, description and date, we need to save them.
        # Then we remove them from the text.
        title = text.split("\n")[0]
        description = text.split("\n")[1]
        date = text.split("\n")[2]

        text = text.replace(title, "")
        text = text.replace(description, "")
        text = text.replace(date, "")
        html = markdown.markdown(text)

        return html, title, description, date


def create_html_file(html, file, title, description, date):
    html_string = f"""<!-- {title} -->
<!-- {description} -->
<!-- {date} -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" type="text/css" href="../css/blog.css">
  <link rel="icon" href="../images/icon.ico" type="image/x-icon">
  <title>ECS - Blog</title>
</head>
<body>
<div class="container">
{html}

  <footer>
    <hr>
    <p>Extra Computer Science</p>
    <p>
      <a href="https://discord.com/users/1143663560468205628" target="_blank">
        <img src="images/discord.png" alt="Discord">
      </a>
       
      <a href="https://github.com/LapisPhoenix/Blog" target="_blank">
        <img src="images/github.png" alt="GitHub">
      </a>
    </p>
  </footer>
</div>
</body>
</html>

"""
    with open(f"./output/{file}.html", 'w') as f:
        s = bs(html_string, "html.parser")
        f.write(s.prettyify())


def main():
    files = [f for f in os.listdir('./input') if f.endswith('.md')]
    tot_start = time.time()
    f = 0
    for file in files:
        start = time.time()
        html, title, desc, date = convert_markdown_to_html(f'./input/{file}')
        create_html_file(html, file.replace(".md", ""), title, desc, date)
        print(f"File {file} converted in {time.time() - start} seconds")
        f += 1

    print(f"Finished converting {f} files in {time.time() - tot_start} seconds")


if __name__ == "__main__":
    main()