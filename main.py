import os
import time
import markdown
from bs4 import BeautifulSoup as bs


html_template_head = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" type="text/css" href="../css/style.css">
  <link rel="icon" href="images/favicon.ico" type="image/x-icon">
  <title>ECS - Blog</title>
</head>
<body>"""


def convert_markdown_to_html(file):
    with open(file, 'r') as f:
        text = f.read()
        html = markdown.markdown(text)
        html = bs(html)
        html = html.prettify()
        return html


def create_html_file(html, file):
    html_string = html_template_head + html + "</body></html>"
    with open(f"./output/{file}.html", 'w') as f:
        f.write(html_string)


def main():
    files = [f for f in os.listdir('./input') if f.endswith('.md')]
    tot_start = time.time()
    f = 0
    for file in files:
        start = time.time()
        html = convert_markdown_to_html(f'./input/{file}')
        create_html_file(html, file.replace(".md", ""))
        print(f"File {file} converted in {time.time() - start} seconds")
        f += 1

    print(f"Finished converting {f} files in {time.time() - tot_start} seconds")


if __name__ == "__main__":
    main()